import { IPage, IParamsRequest } from '@react/commons/types';
import { axiosClient } from 'apps/Internal/src/service';
import { IParameter, IStatus } from '../type';
import { API_PATHS } from './url';
import { TenMinutes } from '@react/constants/app';

export const getSearchNumber = (params: IParameter) => {
  return axiosClient.get(API_PATHS.SEARCH, { params });
};

export const getHistoryIsdn = (
  isdn: string,
  params?: IParamsRequest & { from: string; to: string }
) => {
  return axiosClient.get<string, IPage<any>>(API_PATHS.HISTORY_ISDN(isdn), {
    params,
  });
};

export const getUnKeepIsdn = async (isdn: string) => {
  const responsive = await axiosClient.post(API_PATHS.UN_KEEP_ISDN(isdn));
  return responsive;
};

export const getKeepIsdn = async (isdn: string) => {
  const responsive = await axiosClient.post(API_PATHS.KEEP_ISDN(isdn));
  return responsive;
};

export const getStockIsdn = () => {
  return axiosClient.get(API_PATHS.GET_STOCK_ISDN);
};

export const getStatus = (params: IStatus) => {
  return axiosClient.get(API_PATHS.GET_STATUS, { params });
};

export const exportExcel = (params: IStatus) => {
  return axiosClient.get<string, Blob>(API_PATHS.exportExcel, {
    params,
    timeout: TenMinutes,
    responseType: 'blob',
  });
};
