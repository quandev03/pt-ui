import { IPage } from '@vissoft-react/common';
import { prefixSaleService } from '../../../constants';
import { safeApiClient } from '../../../services/axios';
import {
  ICreatePartnerPackageSubscriptionPayload,
  ICustomerInfo,
  IeSIMStockDetail,
  IPackage,
  IPartnerPackageSubscription,
  IPartnerPackageSubscriptionParams,
} from '../types';

export const eSIMStockServices = {
  getDetaileSIMStock: async (id: string) => {
    return await safeApiClient.get<IeSIMStockDetail[]>(
      `${prefixSaleService}/esim-manager/${id}`
    );
  },
  getPackage: async () => {
    return await safeApiClient.get<IPackage[]>(
      `${prefixSaleService}/esim-manager/package`
    );
  },
  getCustomerInfo: async (id: string) => {
    return await safeApiClient.get<ICustomerInfo>(
      `${prefixSaleService}/esim-manager/detail/${id}`
    );
  },
  getPartnerPackageSubscriptions: (
    params: IPartnerPackageSubscriptionParams
  ) => {
    return safeApiClient.get<IPage<IPartnerPackageSubscription>>(
      `${prefixSaleService}/partner-package-subscriptions`,
      {
        params,
      }
    );
  },
  createPartnerPackageSubscription: (
    payload: ICreatePartnerPackageSubscriptionPayload
  ) => {
    return safeApiClient.post(
      `${prefixSaleService}/partner-package-subscriptions`,
      payload
    );
  },
  stopPartnerPackageSubscription: (subscriptionId: string) => {
    return safeApiClient.post(
      `${prefixSaleService}/partner-package-subscriptions/${subscriptionId}/stop`
    );
  },
};
