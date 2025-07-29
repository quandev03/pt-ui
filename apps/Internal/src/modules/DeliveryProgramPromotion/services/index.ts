import { prefixCatalogService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ICategoryShippingPromotion,
  PayloadUpdateShippingPromotion,
} from '../types';

export interface Req {
  programName?: string;
  channel?: string;
  page: number;
  size: number;
}

export interface Res {
  content: ICategoryShippingPromotion[];
  totalElements: number;
  size: number;
}

export const DeliveryProgramPromotionService = {
  getList: async (params: any) => {
    return axiosClient.get<Req, Res>(
      `${prefixCatalogService}/delivery-program-promotion/search`,
      {
        params,
      }
    );
  },

  add: async (data: any) => {
    const res = await axiosClient.post(
      `${prefixCatalogService}/delivery-program-promotion`,
      data
    );
    return res;
  },
  detail: async (id: string) => {
    const res = await axiosClient.get<string, ICategoryShippingPromotion>(
      `${prefixCatalogService}/delivery-program-promotion/${id}`
    );
    return res;
  },

  delete: async (id: string) => {
    const res = await axiosClient.delete(
      `${prefixCatalogService}/delivery-program-promotion/${id}`
    );
    return res;
  },

  update: async (data: PayloadUpdateShippingPromotion) => {
    const res = await axiosClient.put(
      `${prefixCatalogService}/delivery-program-promotion/${data.id}`,
      data.data
    );
    return res;
  },
};
