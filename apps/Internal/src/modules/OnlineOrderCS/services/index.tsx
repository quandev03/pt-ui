import { IPage } from '@react/commons/types';
import {
  prefixAdminService,
  prefixResourceService,
  prefixSaleServicePrivate,
} from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IOnlineOrdersCSManagement,
  IParamsSenQReSIM,
  ParamsCencelOnlineOrdersCS,
  ParamsOnlineOrdersCSManagement,
  ParamsRefundOrderCS,
} from '../types';

export const OrderCsService = {
  getListChannel: async () => {
    const res = await axiosClient.get(`${prefixResourceService}/sale-channel`);
    return res;
  },
  getOnlineOrdersCS: async (param: ParamsOnlineOrdersCSManagement) => {
    const res = await axiosClient.get<
      ParamsOnlineOrdersCSManagement,
      IPage<IOnlineOrdersCSManagement[]>
    >(`${prefixSaleServicePrivate}/sale-orders/online-order/cs-order/search`, {
      params: param,
    });

    if (!res) throw new Error('Opps');
    return res;
  },
  cancelOnlineOrdersCS: async (body: ParamsCencelOnlineOrdersCS) => {
    const res = await axiosClient.delete<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order`,
      {
        data: body,
      }
    );

    if (!res) throw new Error('Opps');
    return res;
  },

  getListUserRefund: async () => {
    const res = await axiosClient.get<any[]>(
      `${prefixAdminService}/users/internal/all`
    );

    if (!res) throw new Error('Opps');
    return res;
  },

  refundOnlineOrdersCS: async (body: ParamsRefundOrderCS) => {
    const res = await axiosClient.post<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/send-refund-request/${body.id}`,
      body.receiveUser
    );
    return res;
  },

  combineKitOrdersCs: async (id: number) => {
    const res = await axiosClient.post<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/re-combine-kit/${id}`
    );
    return res;
  },
  sendQReSIM: async (params: IParamsSenQReSIM) => {
    const res = await axiosClient.post<any>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/send-esim-qr?id=${params.id}&serial=${params.serial}&email=${params.email}`
    );
    return res;
  },
};
