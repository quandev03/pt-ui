import { prefixCustomerService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IPriorityItem,
  IReflectionCategory,
  PayloadUpdateReflectionCategory,
} from '../types';

export interface Req {
  param?: string;
  typeDate?: number;
  fromDate?: string;
  toDate?: string;
  status?: number;
}

export const ReflectionCategoryService = {
  getList: async (params: any) => {
    return axiosClient.get<Req, IReflectionCategory[]>(
      `${prefixCustomerService}/feedback-type/search`,
      {
        params: {
          ...params,
          typeDate: params.fromDate && params.toDate ? 1 : undefined,
        },
      }
    );
  },

  add: async (data: any) => {
    const res = await axiosClient.post(
      `${prefixCustomerService}/feedback-type`,
      data
    );
    return res;
  },
  detail: async (id: string) => {
    const res = await axiosClient.get<string, IReflectionCategory>(
      `${prefixCustomerService}/feedback-type/${id}`
    );
    return res;
  },

  delete: async (id: string) => {
    const res = await axiosClient.delete(
      `${prefixCustomerService}/feedback-type/${id}`
    );
    return res;
  },

  update: async (data: PayloadUpdateReflectionCategory) => {
    const res = await axiosClient.put(
      `${prefixCustomerService}/feedback-type/${data.id}`,
      data.data
    );
    return res;
  },
  getPriority: async () => {
    const res = await axiosClient.post<any, IPriorityItem[]>(
      `${prefixCustomerService}/get-application-config?type=FEEDBACK_SLA_CONFIG`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
};
