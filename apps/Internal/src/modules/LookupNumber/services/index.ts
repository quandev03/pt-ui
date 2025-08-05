import { IPage, IParamsRequest, TenMinutes } from '@vissoft-react/common';
import { IParameter, IStatus } from '../type';
import { API_PATHS } from './url';
import { safeApiClient } from 'apps/Internal/src/services';

export const getSearchNumber = (params: IParameter) => {
  return safeApiClient.get(API_PATHS.SEARCH, { params });
};

export const getHistoryIsdn = (
  isdn: string,
  params?: IParamsRequest & { from: string; to: string }
) => {
  return safeApiClient.get<IPage<any>>(API_PATHS.HISTORY_ISDN(isdn), {
    params,
  });
};

export const getUnKeepIsdn = async (isdn: string) => {
  const responsive = await safeApiClient.post(API_PATHS.UN_KEEP_ISDN(isdn));
  return responsive;
};

export const getKeepIsdn = async (isdn: string) => {
  const responsive = await safeApiClient.post(API_PATHS.KEEP_ISDN(isdn));
  return responsive;
};

export const getStockIsdn = () => {
  return safeApiClient.get(API_PATHS.GET_STOCK_ISDN);
};

export const getStatus = (params: IStatus) => {
  return safeApiClient.get(API_PATHS.GET_STATUS, { params });
};

export const exportExcel = (params: IStatus) => {
  return safeApiClient.get<Blob>(API_PATHS.exportExcel, {
    params,
    timeout: TenMinutes,
    responseType: 'blob',
  });
};
