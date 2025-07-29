import { prefixCatalogService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ICategoryDeliveryFee,
  PayloadUpdateDeliveryFee,
} from '../types';

export interface Req {
  locationName?: string;
  fromProvince?: string;
  page: number;
  size: number;
}

export interface Res {
  content: ICategoryDeliveryFee[];
  totalElements: number;
  size: number;
}

export const DeliveryFeeCategoryService = {
  getList: async (params: any) => {
    return axiosClient.get<Req, Res>(
      `${prefixCatalogService}/delivery-fee/search`,
      {
        params,
      }
    );
  },

  add: async (data: any) => {
    const res = await axiosClient.post(
      `${prefixCatalogService}/delivery-fee`,
      data
    );
    return res;
  },
  detail: async (id: string) => {
    const res = await axiosClient.get<string, ICategoryDeliveryFee>(
      `${prefixCatalogService}/delivery-fee/${id}`
    );
    return res;
  },

  delete: async (id: string) => {
    const res = await axiosClient.delete(
      `${prefixCatalogService}/delivery-fee/${id}`
    );
    return res;
  },

  update: async (data: PayloadUpdateDeliveryFee) => {
    const res = await axiosClient.put(
      `${prefixCatalogService}/delivery-fee/${data.id}`,
      data.data
    );
    return res;
  },
};
