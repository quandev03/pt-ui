import { AnyElement, useActionMode } from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleConvertIsdn } from '../../utils';
import { useGetPackageCodes } from '../../hooks/useGetPackageCode';
import { useSellSinglePackageStore } from '../../store';
import { ISinglePackageSalePayload } from '../../types';
import { useAddPackageSingle } from '../../hooks';

export const useLogicActionSingleSalePackage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const actionMode = useActionMode();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const { setSalePayload, salePayload } = useSellSinglePackageStore();

  const { data: packageCodeList } = useGetPackageCodes();
  const packageOptions = packageCodeList?.map((pkg) => ({
    key: pkg.id,
    value: pkg.pckCode,
    label: pkg.pckCode,
    price: pkg.packagePrice,
    id: pkg.id,
  }));

  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpenOtp(false);
    setSalePayload(null);
  }, [form, setSalePayload]);

  const { mutate: addPackageSingle, isPending: loadingAdd } =
    useAddPackageSingle(() => {
      handleCancel(); // On success, call the existing cancel logic
    });

  const handleCheckNumberPhone = useCallback(
    (e: AnyElement) => {
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
    },
    [form]
  );

  const handleConfirmOtp = (pinCode: string) => {
    if (!salePayload) return;

    const finalPayload: ISinglePackageSalePayload = {
      ...salePayload,
      pinCode,
    };
    addPackageSingle(finalPayload);
  };

  const handleFormSubmit = useCallback(
    (values: { isdn: string; packageCode: string }) => {
      const selectedPackage = packageOptions?.find(
        (p) => p.value === values.packageCode
      );

      if (!selectedPackage) {
        console.error('Selected package not found');
        return;
      }

      const payload: Omit<ISinglePackageSalePayload, 'pinCode'> = {
        isdn: handleConvertIsdn(values.isdn),
        pckCode: values.packageCode,
      };

      setSalePayload(payload);
      setOpenOtp(true);
    },
    [setSalePayload, packageOptions]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleCloseOtp = useCallback(() => {
    setOpenOtp(false);
  }, []);

  return {
    form,
    handleClose,
    actionMode,
    openOtp,
    setOpenOtp,
    handleCancel,
    handleCheckNumberPhone,
    handleCloseOtp,
    packageOptions,
    handleFormSubmit,
    handleConfirmOtp,
    loadingAdd,
  };
};
