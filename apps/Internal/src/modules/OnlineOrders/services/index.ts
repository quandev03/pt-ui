import { IPage } from '@react/commons/types';
import {
  prefixCatalogService,
  prefixResourceService,
  prefixSaleServicePrivate,
} from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IDetailOnlineOrder,
  IOnlineOrdersManagement,
  IPayloadOnlineOrder,
  IPayloadOnlineOrderForm,
  IPayloadUpdateOrder,
  IResponseCreateOrder,
  IResponseGetFee,
  ParamsOnlineOrdersManagement,
  Req,
} from '../types';

interface Res {
  content: IOnlineOrdersManagement[];
  totalElements: number;
  size: number;
}

export const OnlineOrders = {
  getOnlineOrdersList: async (param: ParamsOnlineOrdersManagement) => {
    const res = await axiosClient.get<Req, Res>(
      `${prefixSaleServicePrivate}/sale-orders/online-order`,
      {
        params: param,
      }
    );

    if (!res) throw new Error('Opps');
    return res;
  },
  updateOnlineOrder: async (body: IPayloadUpdateOrder) => {
    const res = await axiosClient.put<Req, Res>(
      `${prefixSaleServicePrivate}/sale-orders/online-order`,
      body
    );

    if (!res) throw new Error('Opps');
    return res;
  },
  getOnlineOrderDetail: async (id: string | number) => {
    const res = await axiosClient.get<string, IDetailOnlineOrder>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/${id}`
    );
    return res;
  },
  onCreateOnlineOrder: async (id: string | number) => {
    const res = await axiosClient.post<string, IResponseCreateOrder>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/delivery/create/${id}`
    );
    return res;
  },
  getListChannel: async () => {
    const res = await axiosClient.get(`${prefixResourceService}/sale-channel`);
    return res;
  },
  onSelectDVVC: async (request: IPayloadUpdateOrder) => {
    const res = await axiosClient.put<string, IResponseCreateOrder>(
      `${prefixSaleServicePrivate}/sale-orders/online-order/delivery/partner`,
      request
    );
    return res;
  },
  getFeeByPartner: async (id: string, partner: string) => {
    const res = await axiosClient.get<
      { id: string; partner: string },
      IResponseGetFee
    >(
      `${prefixSaleServicePrivate}/sale-orders/online-order/delivery/get-partner-fee/${id}?partner=${partner}`
    );
    return res;
  },
};
