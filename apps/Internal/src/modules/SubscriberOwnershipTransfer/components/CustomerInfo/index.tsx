import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IFieldErrorsItem } from '@react/commons/types';
import { formatDateV2 } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import { Collapse, Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useCheckCustomerInfor } from '../../hooks/useCheckCustomerInfor';
import { useGetOCR } from '../../hooks/useGetOCR';
import { PanelStyled } from '../../page/styles';
import { DocumentTypeEnum } from '../../types';
import CheckOtp from './CheckOtp';
import CustomerInfo from './CustomerInfo';
import CustomerProfile from './CustomerProfile';

const CustomerInfoCopt = () => {
  const [isFlag, setIsFlag] = useState<boolean>(false);
  const form = Form.useFormInstance();
  const { cardFront, cardBack, portrait } =
    Form.useWatch((value) => value, form) ?? {};
  const handleOffOcr = useCallback(() => {
    setIsFlag(false);
  }, []);

  useEffect(() => {
    if (cardFront && cardBack && portrait) {
      setIsFlag(true);
      if (!isFlag) {
        return;
      }
      if (
        [cardFront, cardBack, portrait].some((e) => e?.includes?.('base64'))
      ) {
        return;
      }
      getOCR({
        cardBack,
        cardFront,
        portrait,
      });
    }
  }, [cardFront, cardBack, portrait]);

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
  const {
    mutate: checkCustomerInfor,
    isSuccess: isSuccessCheckingCustomerInfor,
    reset: resetCheckCustomerInfor,
  } = useCheckCustomerInfor((isSuccessSuccess) => {
    if (isSuccessSuccess) {
      NotificationSuccess('Thông tin xác thực chính chủ');
    }
  }, setFieldError);
  const {
    mutate: getOCR,
    isError: isErrorOCR,
    reset: resetOCR,
  } = useGetOCR((data) => {
    resetCheckCustomerInfor();
    if (data.documentType === DocumentTypeEnum.CMND) {
      NotificationError(MESSAGE.G39);
    }
    let gender = '';
    if (data.sex === '1' || data.sex === 'nam' || data.sex === 'Nam') {
      gender = '1';
    } else if (data.sex === '0' || data.sex === 'nữ' || data.sex === 'Nữ') {
      gender = '0';
    }
    form.setFieldsValue({
      transferorName: data.name,
      documentType: data.documentType,
      transferorPlaceOfIssue: data.issueBy,
      transferorDateOfIssue: data.issueDate
        ? dayjs(data.issueDate, formatDateV2)
        : null,
      transferorSex: gender,
      transferorDateOfBirth: data.birthday
        ? dayjs(data.birthday, formatDateV2)
        : null,
      transferorAddress: data.address,
      expiry: data.expiry ? dayjs(data.expiry, formatDateV2) : null,
      city: data.city,
      district: data.district,
      ward: data.ward,
      transferorIdNo: data.id,
      idEkyc: data.idEkyc,
      transferorCountry: data.nationality,
    });
  });

  return (
    <Collapse
      defaultActiveKey={['1']}
      ghost
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <FontAwesomeIcon icon={isActive ? faAnglesUp : faAnglesDown} />
      )}
    >
      <PanelStyled header={'Thông tin khách hàng'} key="1">
        <CustomerProfile handleOffOcr={handleOffOcr} resetOCR={resetOCR} />
        <CustomerInfo
          onCheckingInfor={checkCustomerInfor}
          isSuccessCheckingCustomerInfor={isSuccessCheckingCustomerInfor}
        />
        <CheckOtp
          isSuccessCheckingCustomerInfor={isSuccessCheckingCustomerInfor}
        />
      </PanelStyled>
    </Collapse>
  );
};

export default CustomerInfoCopt;
