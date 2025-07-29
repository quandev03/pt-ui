import {
  prefixAdminService,
  prefixResourceService,
  prefixSaleServicePrivate,
} from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IOnlineOrderAtStoreManagement,
  IParamsUserRefund,
  ParamsCancelOnlineOrderAtStore,
  ParamsOnlineOrderAtStoreManagement,
  ParamsRefundOnlineOrderAtStore,
  Req,
} from '../types';

interface Res {
  content: IOnlineOrderAtStoreManagement[];
  totalElements: number;
  size: number;
}

export const OrderAtStoreService = {
  getListChannel: async () => {
    const res = await axiosClient.get(`${prefixResourceService}/sale-channel`);
    return res;
  },
  getOnlineOrdersAtStore: async (param: ParamsOnlineOrderAtStoreManagement) => {
    const res = await axiosClient.get<Req, Res>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/at-store/search`,
      {
        params: param,
      }
    );

    if (!res) throw new Error('Opps');
    return res;
  },
  cancelOnlineOrdersAtStore: async (body: ParamsCancelOnlineOrderAtStore) => {
    const res = await axiosClient.delete<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order`,
      {
        data: body,
      }
    );
    return res;
  },
  refundOnlineOrdersAtStore: async (body: ParamsRefundOnlineOrderAtStore) => {
    const res = await axiosClient.post<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/send-refund-request/${body.id}`,
      body.receiveUser
    );
    return res;
  },
  getListUserRefund: async (params: IParamsUserRefund) => {
    const res = await axiosClient.get<IParamsUserRefund, any>(
      `${prefixAdminService}/users/internal`,
      { params }
    );

    if (!res) throw new Error('Opps');
    return res;
  },
  combineKitOrdersAtStore: async (id: number) => {
    const res = await axiosClient.post<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/re-combine-kit/${id}`
    );
    return res;
  },
  confirmReceipt: async (id: number) => {
    const res = await axiosClient.put<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/confirm-receipt/${id}`
    );
    return res;
  },
};
