import { faDownLong, faUpLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { Button, Flex, Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { StyledWrapperPage } from 'apps/Internal/src/modules/ActivateSubscription/pages/styles';
import { useEffect, useRef, useState } from 'react';
import CustomerInfo from '../components/CustomerInfo';
import FileList from '../components/FileList';
import ModalConfirm from '../components/ModalConfirm';
import SignInfo from '../components/SignInfo';
import useOwnershipTransferStore from '../store';
import ModalPdf from '../components/ModalPdf';
import { useOwnershipTransfer } from '../hooks/useOwnershipTransfer';
import { NotificationError } from '@react/commons/Notification';
import { useIsMutating } from '@tanstack/react-query';
import { queryKeyGenContract } from '../hooks/useGenContract';
import dayjs from 'dayjs';
import { scrollErrorField } from '../components/SignInfo/CheckOtp';
import { DocumentTypeEnum } from '../types';
import { MESSAGE } from '@react/utils/message';
import { queryKeyIsdnOwnerShip } from '../hooks/useCheckIsdnOwnerShip';
import '../index.scss';
import { queryKeyOldCustomerInfo } from '../hooks/useCheckCustomerInfor';
import { queryKeyOldOcr } from '../hooks/useGetOCR';
import { groupBy } from 'lodash';

const OwnershipTransferPage = () => {
  const {
    resetGroupStore,
    setFormAntd,
    interval,
    isOpenModalPdf,
    setOpenModalPdf,
    contractType,
    isSignSuccess,
    selectedRowKeys,
    dataTransfereeInfo,
    isSuccessCheckCondition,
    isDisableButtonCheck,
  } = useOwnershipTransferStore();
  const [form] = useForm();
  const pageRef = useRef(null);
  const {
    transfereeCardFront,
    transfereeCardBack,
    transfereePortrait,
    cardContract,
    requestFormCCQ,
    ownerCommit,
    decree13,
    file = [],
    transfereeDocument,
    transfereeExpiry,
    idExpiryDateNoteNew,
    expiry,
  } = Form.useWatch((value) => value, form) ?? {};
  const isLoadingOldCustomerInfo = !!useIsMutating({
    mutationKey: [queryKeyOldCustomerInfo],
  });
  const isLoadingGenContract = !!useIsMutating({
    mutationKey: [queryKeyGenContract],
  });
  const isLoadingIsdn = !!useIsMutating({
    mutationKey: [queryKeyIsdnOwnerShip],
  });
  const isLoadingOldOcr = !!useIsMutating({
    mutationKey: [queryKeyOldOcr],
  });
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  // Mapping từ API field sang form field
  const fieldMapping: Record<string, string> = {
    contractNo: 'contractNo',
    document: 'transfereeDocument',
    name: 'transfereeName',
    isdn: 'isdn',
    nationality: 'transfereeCountry',
    id: 'transfereeIdNo',
    issue_by: 'transfereePlaceOfIssue',
    issue_date: 'transfereeDateOfIssue',
    birthday: 'transfereeDateOfBirth',
    sex: 'transfereeSex',
    address: 'transfereeAddress',
    city: 'transfereeCity',
    district: 'transfereeDistrict',
    ward: 'transfereeWard',
    expiry: 'transfereeExpiry',
    providerAreaCode: 'ccdvvt',
    otpReason: 'otpReason',
    passSensor: 'passSensor',
    otpStatus: 'transfereeOtp',
    idExpiryDateNote: 'idExpiryDateNoteNew',
    customerCode: 'customerCode',
  };

  const { mutate: mutateTransfer, isPending: isLoadingTransfer } =
    useOwnershipTransfer(
      () => setIsOpenConfirm(false),
      (err) => {
        setIsOpenConfirm(false);
        if (err?.errors?.length > 0) {
          const newObj = groupBy(err?.errors, 'field');
          const res = Object.entries(newObj).map(([field, obj]) => ({
            field: fieldMapping[field] || field, // Map sang form field hoặc giữ nguyên nếu không có mapping
            detail: obj?.map((item) => item.detail),
          }));
          form.setFields(
            res?.map((item: any) => ({
              name: item.field,
              errors: item.detail,
            }))
          );
          scrollErrorField(); // Scroll đến field có lỗi
        }
      }
    );

  const handleCleanUp = () => {
    clearTimeout(interval);
    resetGroupStore();
  };

  useEffect(() => {
    setFormAntd(form);
    return () => {
      clearTimeout(interval);
      resetGroupStore();
    };
  }, []);

  const handleFinish = async (values: any) => {
    const serverErrors = form
      .getFieldsError()
      .filter((field) => field.errors.length > 0);
    if (serverErrors.length > 0) {
      form.setFields(
        serverErrors.map((field) => ({
          name: field.name,
          errors: field.errors,
        }))
      );
      scrollErrorField();
      return;
    }
    form
      .validateFields()
      .then(() => {
        if (!isDisableButtonCheck) {
          NotificationError('Chưa kiểm tra xác thực thông tin với khách hàng!');
          handleScrollPage('start');
          return;
        }
        if (dataTransfereeInfo.errors?.length > 0 && !isSuccessCheckCondition)
          return;
        if (transfereeDocument === DocumentTypeEnum.CMND) {
          NotificationError(MESSAGE.G39);
          return;
        }
        if (!transfereeExpiry && !idExpiryDateNoteNew) {
          NotificationError(MESSAGE.G40);
          return;
        }
        if (dataTransfereeInfo?.c06_errors) {
          NotificationError(dataTransfereeInfo?.c06_errors);
          return;
        }
        if (
          !isSignSuccess &&
          (!cardContract || !requestFormCCQ || !ownerCommit)
        ) {
          NotificationError(
            'Không có thông tin ảnh hợp đồng/Biên bản xác nhận, phiếu yêu cầu CCQ, bản cam kết chính chủ. Vui lòng tạo biểu mẫu hoặc tạo link ký'
          );
          return;
        }
        if (
          dayjs().isAfter(expiry, 'D') ||
          dayjs().isAfter(transfereeExpiry, 'D')
        ) {
          NotificationError(
            'Thời gian chuyển chủ quyền phải nhỏ hơn hoặc bằng Thời gian hết hạn giấy tờ'
          );
          return;
        }
        setIsOpenConfirm(true);
      })
      .catch((err) => {
        console.log(err, 'err');
        scrollErrorField();
      });
  };

  const handleScrollPage = (type: string) => {
    (pageRef.current as any)?.scrollIntoView({
      block: type,
      behavior: 'smooth',
    });
  };
  const handleSubmit = ({ profileType }: any) => {
    const { otp, ...restValues } = form.getFieldsValue();
    mutateTransfer({
      files: {
        front: transfereeCardFront,
        back: transfereeCardBack,
        portrait: transfereePortrait,
        convince: cardContract,
        decree13: decree13,
        ownershipTransfer: requestFormCCQ,
        ownershipCommitment: ownerCommit,
        referenceFiles: file,
      },
      form: {
        ...restValues,
        passSensor: !!profileType,
        decree13Accept: selectedRowKeys,
        idExpiryDateNote: idExpiryDateNoteNew,
      },
    });
  };
  return (
    <StyledWrapperPage ref={pageRef}>
      <TitleHeader>Chuyển chủ quyền</TitleHeader>
      <Spin
        spinning={
          isLoadingTransfer ||
          isLoadingOldCustomerInfo ||
          isLoadingOldOcr ||
          isLoadingGenContract ||
          isLoadingIsdn
        }
        className="!fixed translate-x-[8.625rem]"
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ lg: { span: 12 }, xl: { span: 6 } }}
          labelWrap
          scrollToFirstError
          colon={false}
          onFinish={handleFinish}
          onFinishFailed={scrollErrorField}
          initialValues={{
            documentType: '1',
            cusType: 'VNS',
            transfereeDocument: '1',
          }}
        >
          <CustomerInfo />
          <FileList />
          <SignInfo />
          <Flex justify="end">
            <RowButton className="my-6">
              <CButton
                htmlType="reset"
                onClick={handleCleanUp}
                className="mt-1 min-w-[8.5rem]"
              >
                Làm mới
              </CButton>
              <CButton
                // htmlType="submit"
                onClick={handleFinish}
                disabled={false}
                className="mt-1 min-w-[8.5rem]"
              >
                Chuyển chủ quyền
              </CButton>
              {isOpenModalPdf && (
                <ModalPdf
                  isOpen={isOpenModalPdf}
                  setIsOpen={setOpenModalPdf}
                  isSign={false}
                  contractType={contractType}
                />
              )}
            </RowButton>
          </Flex>
        </Form>
      </Spin>
      <div className="absolute bottom-20 right-8">
        <Flex gap={8}>
          <Button
            shape="circle"
            onClick={() => handleScrollPage('start')}
            icon={<FontAwesomeIcon icon={faUpLong} />}
            title="Lên đầu"
          ></Button>
          <Button
            shape="circle"
            onClick={() => handleScrollPage('end')}
            icon={<FontAwesomeIcon icon={faDownLong} />}
            title="Xuống cuối"
          ></Button>
        </Flex>
      </div>
      <ModalConfirm
        isOpen={isOpenConfirm}
        setIsOpen={setIsOpenConfirm}
        data={undefined}
        onSubmit={handleSubmit}
        handleCancel={() => setIsOpenConfirm(false)}
        isLoading={isLoadingTransfer}
      />
    </StyledWrapperPage>
  );
};
export default OwnershipTransferPage;
