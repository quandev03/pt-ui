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
  const [openWarning, setOpenWarning] = useState<boolean>(false);
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
    setOpenWarning(false);
    setSalePayload(null);
    navigate(-1);
  }, [form, navigate, setSalePayload]);

  const { mutate: addPackageSingle, isPending: loadingAdd } =
    useAddPackageSingle(() => {
      handleCancel();
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
      }
    },
    [form]
  );

  const handleCloseWarning = useCallback(() => {
    setOpenWarning(false);
  }, []);

  const handleConfirmWarning = useCallback(() => {
    setOpenWarning(false);
    if (!salePayload) return;
    addPackageSingle(salePayload); // Call API here
  }, [salePayload, addPackageSingle]);

  const handleFormSubmit = useCallback(
    (values: { isdn: string; packageCode: string }) => {
      const selectedPackage = packageOptions?.find(
        (p) => p.value === values.packageCode
      );

      if (!selectedPackage) {
        console.error('Selected package not found');
        return;
      }

      const payload: Omit<ISinglePackageSalePayload, 'id'> = {
        isdn: handleConvertIsdn(values.isdn),
        pckCode: values.packageCode,
      };

      setSalePayload(payload);
      setOpenWarning(true);
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
    handleCancel,
    handleCheckNumberPhone,
    handleCloseOtp,
    packageOptions,
    handleFormSubmit,
    loadingAdd,
    openWarning,
    handleConfirmWarning,
    handleCloseWarning,
  };
};
