import { useMutation, useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import {
  ICreatePartnerPackageSubscriptionPayload,
  IPartnerPackageSubscriptionParams,
} from '../types';
import { eSIMStockServices } from '../services';
import { NotificationSuccess } from '@vissoft-react/common';

export const useGetDetaileSIMStock = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_E_SIM_STOCK_DETAIL, id],
    queryFn: () => eSIMStockServices.getDetaileSIMStock(id),
    enabled: !!id,
  });
};

export const useGetAllPackage = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_PACKAGE],
    queryFn: () => eSIMStockServices.getPackage(),
  });
};

export const useGetCustomerInfo = (id: string) => {
  return useQuery({
    queryKey: ['get-customer-info-detail-esim', id],
    queryFn: () => eSIMStockServices.getCustomerInfo(id),
    enabled: !!id,
  });
};

export const useGetPartnerPackageSubscriptions = (
  params: IPartnerPackageSubscriptionParams
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PARTNER_PACKAGE_SUBSCRIPTIONS, params],
    queryFn: () => eSIMStockServices.getPartnerPackageSubscriptions(params),
  });
};

export const useRegisterService = (
  onSuccess?: () => void
) => {
  return useMutation({
    mutationFn: (payload: ICreatePartnerPackageSubscriptionPayload) =>
      eSIMStockServices.createPartnerPackageSubscription(payload),
    onSuccess: () => {
      NotificationSuccess('Thêm đăng ký dịch vụ thành công');
      onSuccess?.();
    },
  });
};

export const useStopPartnerPackageSubscription = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (id: string) =>
      eSIMStockServices.stopPartnerPackageSubscription(id),
    onSuccess: () => {
      NotificationSuccess('Dừng gói dịch vụ thành công');
      onSuccess?.();
    },
  });
};
