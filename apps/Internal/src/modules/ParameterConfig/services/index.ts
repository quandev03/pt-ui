import { prefixCatalogService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ICategoryParameterConfig,
  PayloadUpdateParameterConfig,
} from '../types';

export interface Req {
  page: number;
  size: number;
}

export interface Res {
  content: ICategoryParameterConfig[];
  totalElements: number;
  size: number;
}

export const ParameterConfigService = {
  getList: async (params: any) => {
    return axiosClient.get<Req, Res>(
      `${prefixCatalogService}/parameter/search`,
      {
        params,
      }
    );
  },

  add: async (data: any) => {
    const res = await axiosClient.post(
      `${prefixCatalogService}/parameter`,
      data
    ); 
    return res;
  },

  detail: async (id: string) => {
    const res = await axiosClient.get<string, ICategoryParameterConfig>(
      `${prefixCatalogService}/parameter/${id}`
    );
    return res;
  },
  
  delete: async (id: string) => {
    const res = await axiosClient.delete(
      `${prefixCatalogService}/parameter/${id}`
    );
    return res;
  },

  update: async (data: PayloadUpdateParameterConfig) => {
    const res = await axiosClient.put(
      `${prefixCatalogService}/parameter/${data.id}`,
      data.data
    );
    return res;
  },
};
