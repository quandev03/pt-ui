import { RowButton } from '@react/commons/Template/style';
import { Flex, Form, Modal } from 'antd';
import CButton from '@react/commons/Button';
import { useChangeSimPay } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useChangeSimPay';
import { scrollErrorField } from 'apps/Internal/src/modules/ActivateSubscription/components/CheckOtp';
import { useStatusChangeSimPay } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useStatusChangeSimPay';
import { useChangeSimActivate } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useChangeSimActivate';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { ActionType } from '@react/constants/app';
import { useSendMailEsim } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useSendMailEsim';
import { SimTypeEnum } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/components/AddEditView/InfoSim/ChangeSim';
import ReasonModal from './ReasonModal';
import { useChangeSimUpdate } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useChangeSimUpdate';
import { ReasonChangeSimEnum } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useGenContractChangeSim';
import { DocumentTypeEnum } from 'apps/Internal/src/modules/SubscriberOwnershipTransfer/types';
import { NotificationError } from '@react/commons/Notification';
import { StatusChangeSimEnum } from '../../../hooks/useView';

type Props = {
  typeModal: ActionType;
};

const Footer: FC<Props> = ({ typeModal }) => {
  const form = Form.useFormInstance();
  const navigate = useNavigate();
  const feeAmount = Form.useWatch('feeAmount', form);
  const paySuccess = Form.useWatch('paySuccess', form);
  const status = Form.useWatch('status', form);
  const payStatus = Form.useWatch('payStatus', form);
  const cardContract = Form.useWatch('cardContract', form);
  const simType = Form.useWatch('simType', form);
  const actionAllow = Form.useWatch('actionAllow', form);
  const requestType = Form.useWatch('requestType', form);
  const { mutate: mutateChangeSimPay, isPending: isPendingChangeSimPay } =
    useChangeSimPay();
  const { mutate: mutateChangeSimUpdate, isPending: isPendingChangeSimUpdate } =
    useChangeSimUpdate();
  const {
    mutate: mutateChangeSimActivate,
    isPending: isPendingChangeSimActivate,
  } = useChangeSimActivate();
  const { mutate: mutateStatusChangeSimPay } = useStatusChangeSimPay(true);
  const {
    changeSimCode,
    resetGroupStore,
    setChangeSimCode,
    payData,
    enableCheck,
    disableForm,
    isSignSuccess,
    isOpenModalReason,
    documentType,
    setOpenModalReason,
    lpd,
    isPendingSerialNew
  } = useStoreListOfRequestsChangeSim();
  const { mutate: sendMailEsimMutate, isPending: isSending } =
    useSendMailEsim();
  const handleStatusChangeSimPay = () => {
    mutateStatusChangeSimPay({
      requestId: form.getFieldValue('contractId'),
      check: true,
    });
  };

  const handlePay = () => {
    if (documentType === DocumentTypeEnum.CMND) {
      NotificationError(
        'Từ ngày 01/01/2025 không thể đổi sim với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
      );
    }
    if (form.getFieldValue('isFakeOcr')) {
      return Modal.warning({
        centered: true,
        okText: 'Đóng',

        title:
          'Thông tin thuê bao không chính chủ. Vui lòng báo khách hàng lên app cập nhật lại thông tin để thực hiện đổi SIM',
      });
    }
    form
      .validateFields([
        'simType',
        'id',
        'name',
        'email',
        'address',
        'isdn',
        'serial',
        'reason',
        'feeAmount',
        'deliveryMethod',
        'receiverName',
        'province',
        'district',
        'precinct',
        'receiverAddress',
        'documentType',
        'issueBy',
        'issueDate',
        'sex',
        'birthday',
        'nationality',
        'address',
        'newImsi',
        'receiverPhone',
        'provinceName',
        'oldSerialSim',
        'lpaData',
        'cardFront',
        'cardBack',
        'portrait',
        'cardContract',
        'stockId',
        'note',
      ])
      .then((value) => {
        mutateChangeSimPay({
          ...value,
          changeSimCode,
          typeModal: payData ? ActionType.VIEW : typeModal,
        });
      });
    scrollErrorField();
  };

  const handleApprove = () => {
    form
      .validateFields([
        'contractId',
        'simType',
        'serial',
        'reason',
        'receiverName',
        'receiverPhone',
        'deliveryMethod',
        'receiverAddress',
        'storeAddress',
        'province',
        'note',
        'dataContract',
        'email',
        'receiptMethod',
        'stockId',
      ])
      .then((value) => {
        mutateChangeSimUpdate(
          {
            simChangeRequestData: {
              id: value.contractId,
              requestSimType: value.simType,
              newSerial: value.serial,
              reasonCode: value.reason,
              receiverName: value.receiverName,
              phoneNumber: value.receiverPhone,
              deliveryMethod: value.deliveryMethod,
              receiverAddress: value.receiverAddress,
              receiverProvince: value.province,
              note: value.note,
              receiptMethod: value.receiptMethod,
              storeAddress: value.storeAddress,
              stockId: value.stockId,
              lpaData: lpd
            },
            genChangeSimContractData: {
              ...value.dataContract,
              typeSim: value.simType,
              changeSimNo:
                (value.simType === SimTypeEnum.Esim ? 'DSES' : 'DSVL') +
                changeSimCode,
              firstSerialSimNew:
                value.reason === ReasonChangeSimEnum.changeToEsim ||
                  value.reason === ReasonChangeSimEnum.changeToPhysicalSim
                  ? ''
                  : value.serial,

              secondSerialSimNew:
                value.reason === ReasonChangeSimEnum.changeToEsim ||
                  value.reason === ReasonChangeSimEnum.changeToPhysicalSim
                  ? value.serial
                  : '',
              email: value.email,
              phoneNumber: value.receiverPhone,
            },
          },
          {
            onSuccess: () => {
              mutateChangeSimActivate({
                requestId: changeSimCode,
              });
            },
          }
        );
      });
    scrollErrorField();
  };

  const handleChangeSim = () => {
    if (documentType === DocumentTypeEnum.CMND) {
      NotificationError(
        'Từ ngày 01/01/2025 không thể đổi sim với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
      );
    }
    if (form.getFieldValue('isFakeOcr')) {
      return Modal.warning({
        centered: true,
        okText: 'Đóng',

        title:
          'Thông tin thuê bao không chính chủ. Vui lòng báo khách hàng lên app cập nhật lại thông tin để thực hiện đổi SIM',
      });
    }

    if (feeAmount === 0 && typeModal === ActionType.ADD) {
      handlePay();
    } else {
      mutateChangeSimActivate({
        requestId: changeSimCode,
      });
    }
  };
  const handleRefresh = () => {
    form.resetFields();
    resetGroupStore();
    setChangeSimCode();
  };

  const handleCancel = () => {
    if (typeModal === ActionType.VIEW) {
      return navigate(-1);
    }
    if (
      status === StatusChangeSimEnum.PENDING && //  0 Chưa xử lý
      payStatus === '1' //  1 Đã thanh toán
    ) {
      Modal.info({
        centered: true,
        okText: 'Đóng',
        title: 'Bản ghi đã được lưu lại để chờ xử lý đổi SIM tiếp',
      });
    }
    if (
      payStatus === '0' && //  0 Chưa thanh toán
      disableForm
    ) {
      Modal.info({
        centered: true,
        okText: 'Đóng',
        title: 'Bản ghi đã được lưu lại để chờ xử lý thanh toán tiếp',
      });
    }
    navigate(-1);
  };

  return (
    <Flex justify="end">
      <RowButton className="my-6">
        {typeModal === ActionType.ADD && (
          <CButton
            onClick={handleRefresh}
            disabled={!!payData || disableForm}
            className="mt-1 min-w-[8.5rem]"
          >
            Làm mới
          </CButton>
        )}
        {(typeModal === ActionType.ADD ||
          (typeModal === ActionType.VIEW &&
            requestType === 'BCSS' &&
            status === StatusChangeSimEnum.PENDING)) && ( //0 Chưa xử lý
            <>
              {feeAmount === 0 || !!paySuccess ? (
                <CButton
                  className="mt-1 min-w-[8.5rem]"
                  onClick={handleChangeSim}
                  disabled={actionAllow === 0}
                  loading={isPendingChangeSimActivate || isPendingSerialNew || isPendingChangeSimPay}
                >
                  Đổi SIM
                </CButton>
              ) : (
                <CButton
                  className="mt-1 min-w-[8.5rem]"
                  onClick={handlePay}
                  disabled={
                    (!!payData && !enableCheck) ||
                    (!cardContract && !isSignSuccess) ||
                    actionAllow === 0
                  }
                  loading={isPendingChangeSimPay || isPendingSerialNew}
                >
                  Thanh toán
                </CButton>
              )}

              <CButton
                disabled={!enableCheck || actionAllow === 0}
                onClick={handleStatusChangeSimPay}
                className="mt-1 min-w-[8.5rem]"
              >
                Kiểm tra giao dịch
              </CButton>
            </>
          )}
        {typeModal === ActionType.VIEW &&
          requestType !== 'BCSS' &&
          status === StatusChangeSimEnum.PENDING && ( //0 Chưa xử lý
            <>
              <CButton
                className="mt-1 min-w-[8.5rem]"
                onClick={handleApprove}
                disabled={actionAllow === 0}
                loading={isPendingChangeSimUpdate}
              >
                Phê duyệt
              </CButton>
              <CButton
                danger
                className="mt-1 min-w-[8.5rem]"
                onClick={() => setOpenModalReason(true)}
                disabled={actionAllow === 0}
              >
                Từ chối
              </CButton>
            </>
          )}
        {typeModal === ActionType.VIEW &&
          status === StatusChangeSimEnum.APPROVED && //  1 Đã xử lý
          (payStatus === '1' || !payStatus) && //  1 Đã thanh toán
          simType === SimTypeEnum.Esim && (
            <CButton
              className="mt-1 min-w-[8.5rem]"
              disabled={actionAllow === 0}
              onClick={() => sendMailEsimMutate({ requestId: changeSimCode })}
              loading={isSending}
            >
              Gửi email
            </CButton>
          )}
        <CButton
          disabled={false}
          type="default"
          className="mt-1 min-w-[8.5rem]"
          onClick={handleCancel}
        >
          Đóng
        </CButton>
        <Form.Item label="" name="paySuccess" hidden />
        <Form.Item label="" name="status" hidden />
        <Form.Item label="" name="dataContract" hidden />
        {isOpenModalReason && <ReasonModal />}
      </RowButton>
    </Flex>
  );
};
export default Footer;
