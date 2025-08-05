import { AnyElement, useActionMode } from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  usePrefixIsdnQuery,
  usePrefixIsdnRegex,
} from '../../../../../src/hooks/usePrefixIsdnRegex';
import { useCheckIsdnAndGetPackage } from '../../hooks/useCheckIsdnAndGetPackage';
import { useGenOtp } from '../../hooks/useGenOtp';
import { useSellSinglePackageStore } from '../../store';
import { handleConvertIsdn } from '../../utils';

export const useLogicActionSingleSalePackage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const actionMode = useActionMode();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const [optionPackage, setOptionPackage] = useState<
    { label: string; value: string; cycle: number | string; unit: string }[]
  >([]);
  const { setDataGenOtp, setCount, reset } = useSellSinglePackageStore();
  const prefixIsdn = usePrefixIsdnRegex();
  const { data: prefixIsdnAll } = usePrefixIsdnQuery();
  const regexPrefixIsdn = useMemo(() => {
    if (!prefixIsdnAll) return;
    const newData = (prefixIsdnAll ?? [])
      ?.map((item) => item.substring(1))
      ?.join('|');
    const prefixIsdn = new RegExp(`^0?(${newData})`);
    return prefixIsdn;
  }, [prefixIsdnAll]);
  const {
    mutate: checkIsdnAndGetPackage,
    isPending: loadingCheckIsdnAndGetPackage,
  } = useCheckIsdnAndGetPackage((data) => {
    setOptionPackage(
      data.map((option) => ({
        label: option.packageCode,
        value: option.packageId,
        cycle: option.cycle,
        unit: option.unit,
      }))
    );
  });
  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpenOtp(false);
    reset();
  }, [form, reset]);
  const handleCheckNumberPhone = useCallback(
    (e: AnyElement) => {
      const value = e.target.value.trim();
      if (regexPrefixIsdn?.test(value) && value) {
        if (value.startsWith('84')) {
          form.setFieldValue('isdn', value.replace('84', '0'));
          form.validateFields(['isdn']);
          checkIsdnAndGetPackage({
            isdn: handleConvertIsdn(value),
            type: form.getFieldValue('typePayment'),
          });
        } else if (
          !value.startsWith('0') &&
          value.length > 0 &&
          value.length < 11
        ) {
          form.setFieldValue('isdn', '0' + value);
          form.validateFields(['isdn']);
          checkIsdnAndGetPackage({
            isdn: handleConvertIsdn(value),
            type: form.getFieldValue('typePayment'),
          });
        } else if (
          value.startsWith('0') &&
          value.length > 0 &&
          value.length <= 11
        ) {
          checkIsdnAndGetPackage({
            isdn: handleConvertIsdn(value),
            type: form.getFieldValue('typePayment'),
          });
        } else if (value.length === 11) {
          form.setFields([
            {
              name: 'isdn',
              errors: ['Số thuê bao không đúng định dạng'],
            },
          ]);
          return;
        }
      }
    },
    [form, checkIsdnAndGetPackage, regexPrefixIsdn]
  );
  const { mutate: genOtp } = useGenOtp((data) => {
    const { idPackage, isdn, typePayment } = form.getFieldsValue();
    setDataGenOtp({
      isdn,
      transactionId: data.transactionId,
      id: data.id,
      otp: undefined,
      cycle: optionPackage.find((item) => item.value === idPackage)?.cycle,
      unit: optionPackage.find((item) => item.value === idPackage)?.unit,
      type: typePayment,
      idPackage: idPackage,
      pckCode: optionPackage.find((item) => item.value === idPackage)?.label,
    });
    setOpenOtp(true);
    setCount(120);
  });
  const handleOpenOtp = useCallback(
    (value: AnyElement) => {
      const data = {
        isdn: handleConvertIsdn(value.isdn),
        isPackage: value.idPackage,
        pckCode: optionPackage.find((item) => item.value === value.idPackage)
          ?.label,
        typePayment: Number(value.typePayment),
      };
      genOtp(data);
    },
    [genOtp, optionPackage]
  );
  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  const handleCloseOtp = useCallback(() => {
    setOpenOtp(false);
  }, [setOpenOtp]);
  return {
    form,
    handleClose,
    actionMode,
    prefixIsdn,
    optionPackage,
    setOptionPackage,
    loadingCheckIsdnAndGetPackage,
    openOtp,
    setOpenOtp,
    handleOpenOtp,
    handleCancel,
    handleCheckNumberPhone,
    handleCloseOtp,
  };
};
