import { Form } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathRoutes } from '../../../../routers';
import { useGetPurchaseHistory, usePurchasePackage } from '../../hooks';
import { IPurchaseHistoryItem, IPurchasePackagePayload } from '../../types';

const PACKAGE_OPTIONS_PAGE_SIZE = 100;

export const useLogicPurchasePackage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNavigateList = useCallback(() => {
    navigate(pathRoutes.salePackagePurchaseList as string);
  }, [navigate]);

  const { data: purchaseOptions, isLoading: loadingOptions } =
    useGetPurchaseHistory({
      page: 0,
      size: PACKAGE_OPTIONS_PAGE_SIZE,
    });

  const packageOptions = useMemo(() => {
    const items = purchaseOptions?.content ?? [];
    return items.map((item: IPurchaseHistoryItem) => ({
      label: `${item.packageName} (${item.packageCode})`,
      value: item.packageProfileId || item.id,
    }));
  }, [purchaseOptions]);

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

