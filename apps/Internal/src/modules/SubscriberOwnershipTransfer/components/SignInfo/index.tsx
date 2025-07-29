import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnyElement, IFieldErrorsItem } from '@react/commons/types';
import { formatDateV2 } from '@react/constants/moment';
import { Collapse, Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useCheckNewCustomer8Condition } from '../../hooks/useCheckNewCustomer8Condition';
import { useGetActivationInfoOCR } from '../../hooks/useGetActivationInfoOCR';
import { useGetShowOtpTransferee } from '../../hooks/useGetShowOtpTransferee';
import { PanelStyled } from '../../page/styles';
import ActivateInfo from './ActivateInfo';
import CheckOtp from './CheckOtp';
import FormCheckND13 from './FormCheckND13';
import { groupBy } from 'lodash';

const fieldInfoMap: { [key: string]: string } = {
  name: 'transfereeName',
  document: 'transfereeDocument',
  sex: 'transfereeSex',
  address: 'transfereeAddress',
  city: 'transfereeCity',
  district: 'transfereeDistrict',
  ward: 'transfereeWard',
  id: 'transfereeIdNo',
  expiry: 'transfereeExpiry',
  birthday: 'transfereeDateOfBirth',
  issue_by: 'transfereePlaceOfIssue',
  issueDate: 'transfereeDateOfIssue',
};

const InfoSim = () => {
  const form = Form.useFormInstance();
  const { mutate: mutateShowOtp, isPending: loadingShowOtp } =
    useGetShowOtpTransferee();
  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      if (fieldErrors && fieldErrors.length > 0) {
        handleFieldError(fieldErrors);
      }
    },
    [form]
  );

  const { mutate: getOCR, isPending: loadingOCR } = useGetActivationInfoOCR(
    (data) => {
      let gender = '';
      if (data.sex === '1' || data.sex === 'nam' || data.sex === 'Nam') {
        gender = '1';
      } else if (data.sex === '0' || data.sex === 'nữ' || data.sex === 'Nữ') {
        gender = '0';
      }
      mutateShowOtp(
        {
          id: data.id,
          listPhoneNumber: data.list_phoneNumber,
        },
        {
          onSuccess: (res) => {
            form.setFieldValue('isShowNewOTP', res);
          },
        }
      );
      form.setFieldsValue({
        transfereeName: data.name,
        transfereeDocument: data.document,
        transfereePlaceOfIssue: data.issue_by,
        transfereeSex: gender,
        transfereeAddress: data.address,
        transfereeCity: data.city,
        transfereeDistrict: data.district,
        transfereeWard: data.ward,
        transfereeIdNo: data.id,
        transfereeExpiry: data.expiry ? dayjs(data.expiry, formatDateV2) : null,
        transfereeDateOfBirth: data.birthday
          ? dayjs(data.birthday, formatDateV2)
          : null,
        transfereeDateOfIssue: data.issue_date
          ? dayjs(data.issue_date, formatDateV2)
          : null,
        transfereeIdEkyc: data.id_ekyc,
        transfereeCountry: data.nationality,
      });
      if (data.errors && data.errors.length > 0) {
        handleFieldError(data.errors);
      }
    }
  );

  const handleFieldError = (errs: IFieldErrorsItem[]) => {
    const newObj = groupBy(errs, 'field');
    const res = Object.entries(newObj).map(([field, obj]) => ({
      name: fieldInfoMap[field],
      errors: obj?.map((item) => item.detail),
    }));
    form.setFields(res);
  };

  const { mutate: checkCustomerInfor, isPending: loadingCheckCustomerInfor } =
    useCheckNewCustomer8Condition(() => {
      console.log('🚀 ~ isSuccessSuccess');
    }, setFieldError);

  const transfereeCardFront = Form.useWatch('transfereeCardFront', form);
  const transfereeCardBack = Form.useWatch('transfereeCardBack', form);
  const transfereePortrait = Form.useWatch('transfereePortrait', form);
  const phoneInfo = Form.useWatch('isdn', form);
  useEffect(() => {
    if (transfereeCardFront && transfereeCardBack && transfereePortrait) {
      if (
        [transfereeCardFront, transfereeCardBack, transfereePortrait].some(
          (e) => e?.includes?.('base64')
        )
      ) {
        return;
      }
      getOCR(
        {
          payload: {
            cardBack: transfereeCardBack,
            cardFront: transfereeCardFront,
            portrait: transfereePortrait,
          },
          data: {
            isdn: phoneInfo.replace(/^0+/, ''),
          },
        },
        {
          onSuccess: () => {
            form.setFieldValue('isShowNewOTP', true);
          },
        }
      );
    }
  }, [transfereeCardFront, transfereeCardBack, transfereePortrait]);

  const isLoading = loadingOCR || loadingCheckCustomerInfor || loadingShowOtp;

  return (
    <Collapse
      defaultActiveKey={['1']}
      ghost
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <FontAwesomeIcon icon={isActive ? faAnglesUp : faAnglesDown} />
      )}
    >
      <PanelStyled header={'Thông tin khách hàng mới'} key="1" className="cccc">
        <FormCheckND13 />
        <ActivateInfo
          isLoading={isLoading}
          onCheckingInfor={checkCustomerInfor}
        />
        <CheckOtp />
      </PanelStyled>
    </Collapse>
  );
};

export default InfoSim;
