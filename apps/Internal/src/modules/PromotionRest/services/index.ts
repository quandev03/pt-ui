import { axiosClient } from 'apps/Internal/src/service';
import {
  IParamsCheckExists,
  IPromotionRest,
  PayloadAddPromotionRest,
  PayloadUpdatePromotionRest,
} from '../types';
import { urlPromotionRest } from './url';

export interface Req {
  programName?: string;
  channel?: string;
  page: number;
  size: number;
}

export interface Res {
  content: IPromotionRest[];
  totalElements: number;
  size: number;
}

export const PromotionRestService = {
  getList: async (params: any) => {
    return axiosClient.get<Req, Res>(`${urlPromotionRest}/search`, {
      params,
    });
  },
  add: async (data: PayloadAddPromotionRest) => {
    const res = await axiosClient.post(`${urlPromotionRest}/create`, data);
    return res;
  },
  update: async (data: PayloadUpdatePromotionRest) => {
    const { promotionProgramDto } = data;
    const res = await axiosClient.put(
      `${urlPromotionRest}/update/${promotionProgramDto.id}`,
      data
    );
    return res;
  },
  detail: async (id: string) => {
    const res = await axiosClient.get<string, IPromotionRest>(
      `${urlPromotionRest}/detail/${id}`
    );
    return res;
  },
  checkExists: async (params: IParamsCheckExists) => {
    const res = await axiosClient.get(
      `${urlPromotionRest}/checkExists/${params.promotionCode}`
    );
    return res;
  },

  detailExecutePromotion: async (id: string) => {
    const res = await axiosClient.get<any, any>(
      `${urlPromotionRest}/execute/get-promotion/${id}`
    );
    return res;
  },
};
