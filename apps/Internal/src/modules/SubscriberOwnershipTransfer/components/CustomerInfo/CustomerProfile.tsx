import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CInput from '@react/commons/Input';
import { IFieldErrorsItem } from '@react/commons/types';
import validateForm from '@react/utils/validator';
import { Col, Form, Row, Tooltip } from 'antd';
import { usePrefixIsdnRegex } from 'apps/Internal/src/hooks/usePrefixIsdnQuery';
import { usePreviewFile } from 'apps/Internal/src/hooks/usePreviewFile';
import dayjs from 'dayjs';
import { FC, useCallback, useEffect } from 'react';
import { useCheckIsdnOwnerShip } from '../../hooks/useCheckIsdnOwnerShip';
import useOwnershipTransferStore from '../../store';
import UploadImage from './UploadImage';
import { usePrefixIsdnQuery } from '../../hooks/usePrefixIsdnQuery';

type CustomerProfileProps = {
  resetOCR: () => void;
  handleOffOcr: () => void;
};

const CustomerProfile: FC<CustomerProfileProps> = ({
  resetOCR,
  handleOffOcr,
}) => {
  const form = Form.useFormInstance();
  const prefixIsdn = usePrefixIsdnRegex();
  const { data: prefixIsdnRegex } = usePrefixIsdnQuery();
  const {
    setIsSuccessIsdn,
    setDataTransferorInfo,
    setDisableButtonCheck,
    setCheckIsSuccessGetOTPCustomer,
    setCheckIsSuccessConfirmOTP,
  } = useOwnershipTransferStore();
  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );
  const { mutateAsync: mutatePreviewFile, isPending: isLoadingFile } =
    usePreviewFile();
  const { mutate: checkIsdnOwnerShip, isSuccess: isSuccessIsdn } =
    useCheckIsdnOwnerShip(() => {}, setFieldError);

  useEffect(() => {
    setIsSuccessIsdn(isSuccessIsdn);
  }, [isSuccessIsdn]);

  const handleRefreshRepresentativeInformation = useCallback(() => {
    handleOffOcr();
    setCheckIsSuccessGetOTPCustomer(false);
    setCheckIsSuccessConfirmOTP(false);
    form.resetFields([
      'cardFront',
      'cardBack',
      'portrait',
      'cusType',
      'documentType',
      'transferorPlaceOfIssue',
      'transferorSex',
      'transferorAddress',
      'expiry',
      'idExpiryDateNote',
      'transferorName',
      'transferorIdNo',
      'transferorDateOfIssue',
      'transferorDateOfBirth',
      'city',
      'district',
      'ward',
      'isdn',
      'isShowOldOTP',
      'idEkyc',
    ]);
    resetOCR();
    setDisableButtonCheck(true);
    setIsSuccessIsdn(false);
  }, [form, resetOCR, handleOffOcr]);

  const handleCheckNumberPhone = (e: any) => {
    const value = e.target.value.trim();
    if (value.startsWith('84')) {
      form.setFieldValue('isdn', value.replace('84', '0'));
      form.validateFields(['isdn']);
    } else if (
      !value.startsWith('0') &&
      value.length > 0 &&
      value.length < 11
    ) {
      form.setFieldValue('isdn', '0' + value);
      form.validateFields(['isdn']);
    } else if (value.length === 11) {
      form.setFields([
        {
          name: 'isdn',
          errors: ['Số thuê bao không đúng định dạng'],
        },
      ]);
      return;
    }
  };

  const handleBlurIsdn = (value: string) => {
    if (value && value.length >= 9 && prefixIsdnRegex?.test(value)) {
      handleOffOcr();
      checkIsdnOwnerShip(value, {
        onSuccess: ({
          cusType,
          isShowOTP,
          front,
          back,
          portrait,
          inforSub,
          idEkyc,
        }) => {
          if (cusType) form.setFieldValue('cusType', cusType);
          form.setFieldValue('isShowOldOTP', isShowOTP);
          Promise.all(
            [front, back, portrait].map((uri) => mutatePreviewFile({ uri }))
          ).then((res) => {
            form.resetFields(['cardFront', 'cardBack', 'portrait']);
            form.setFieldsValue({
              cardFront: res[0],
              cardBack: res[1],
              portrait: res[2],
              transferorName: inforSub.name,
              cusType: inforSub.cusType,
              documentType: inforSub.idType,
              transferorPlaceOfIssue: inforSub.issueBy,
              transferorDateOfIssue: inforSub.issueDate
                ? dayjs(inforSub.issueDate)
                : null,
              transferorSex: inforSub.sex,
              transferorDateOfBirth: inforSub.birthday
                ? dayjs(inforSub.birthday)
                : null,
              transferorAddress: inforSub.address,
              expiry: inforSub.expiry ? dayjs(inforSub.expiry) : null,
              city: inforSub.city,
              district: inforSub.district,
              ward: inforSub.ward,
              transferorIdNo: inforSub.idNo,
              transferorCountry: inforSub.nationality,
              idEkyc: idEkyc,
            });
            setDataTransferorInfo({ ...inforSub, id: inforSub.idNo });
          });
        },
      });
    }
  };
  return (
    <fieldset className="bg-white">
      <legend>
        Hồ sơ khách hàng
        <Tooltip title="Làm mới">
          <FontAwesomeIcon
            icon={faRotateRight}
            className="cursor-pointer self-center"
            onClick={handleRefreshRepresentativeInformation}
          />
        </Tooltip>
      </legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Số thuê bao"
            name="isdn"
            validateTrigger="onChange"
            rules={[
              validateForm.required,
              validateForm.maxLength(11),
              prefixIsdn,
            ]}
          >
            <CInput
              placeholder="Số thuê bao"
              onlyNumber
              preventSpace
              minLength={10}
              maxLength={11}
              onBlur={(e) => {
                handleCheckNumberPhone(e);
                handleBlurIsdn(e.target.value);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
        <Col span={24}>
          <Row gutter={12}>
            <Col span={8}>
              <UploadImage name="cardFront" label="Ảnh GTTT mặt trước" />
            </Col>
            <Col span={8}>
              <UploadImage name="cardBack" label="Ảnh GTTT mặt sau" />
            </Col>
            <Col span={8}>
              <UploadImage name="portrait" label="Ảnh chân dung" />
            </Col>
          </Row>
        </Col>
        <Form.Item name="isShowOldOTP" hidden />
      </Row>
    </fieldset>
  );
};

export default CustomerProfile;
