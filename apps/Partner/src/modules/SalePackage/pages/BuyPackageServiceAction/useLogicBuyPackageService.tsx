import { Form } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathRoutes } from '../../../../routers';
import { useGetPackageCodes, usePurchasePackage } from '../../hooks';
import { IPurchasePackagePayload } from '../../types';

export const useLogicBuyPackageService = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNavigateList = useCallback(() => {
    navigate(pathRoutes.buyPackageService as string);
  }, [navigate]);

  const { data: packageCodesData, isLoading: loadingOptions } =
    useGetPackageCodes();

  const packageOptions = useMemo(() => {
    if (!packageCodesData) return [];
    return packageCodesData.map((pkg) => ({
      label: pkg.pckName || pkg.pckCode,
      value: pkg.id,
    }));
  }, [packageCodesData]);

  const { mutate: purchasePackage, isPending: loadingSubmit } =
    usePurchasePackage(() => {
      form.resetFields();
      handleNavigateList();
    });

  const handleSubmit = useCallback(
    (values: { packageProfileId: string; paymentMethod: string }) => {
      if (!values.packageProfileId) return;
      const payload: IPurchasePackagePayload = {
        packageProfileId: values.packageProfileId,
      };
      if (values.paymentMethod === 'cash') {
        payload.isMoney = true;
      }
      purchasePackage(payload);
    },
    [purchasePackage]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    handleNavigateList();
  }, [form, handleNavigateList]);

  return {
    form,
    packageOptions,
    loadingOptions,
    loadingSubmit,
    handleSubmit,
    handleCancel,
  };
};
