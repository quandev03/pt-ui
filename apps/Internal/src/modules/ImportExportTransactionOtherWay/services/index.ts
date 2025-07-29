import { IPage } from '@react/commons/types';
import { TenMinutes } from '@react/constants/app';
import { MODE_METHOD } from '@react/constants/eximTransaction';
import { prefixSaleService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IDownoadFile,
  IItemProduct,
  IParamsProducts,
  IPayloadTransaction,
  ISerialItem,
  ITransaction,
  OrdCurrent,
  ParamsSearch,
} from '../type';
import { API_PATHS } from './url';

export const createExportTransactionApi = (data: IPayloadTransaction) => {
  const formData = new FormData();
  formData.append(
    'stockMoveDTO',
    new Blob([JSON.stringify(data.stockMoveDTO)], {
      type: 'application/json',
    })
  );
  if (data.attachments) {
    formData.append('attachments', data.attachments as Blob);
  }
  return axiosClient.post<string, Blob>(
    `${prefixSaleService}/stock-move/ticket-${
      data.stockMoveDTO.moveMethod === MODE_METHOD.IMPORT ? 'in' : 'out'
    }-other`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
      timeout: TenMinutes,
    }
  );
};

export const getOrgId = () => {
  return axiosClient.get<string, OrdCurrent[]>(API_PATHS.ORG_ID);
};

export const getListProducts = async (params: IParamsProducts) => {
  return await axiosClient.get(API_PATHS.PRODUCTS, { params });
};

export const getNumber = () => {
  return axiosClient.get(API_PATHS.GET_NUMBER);
};

export const getInfoFileExport = (formData: any) => {
  return axiosClient.post(API_PATHS.GET_DATA_FILE_EXPORT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
    timeout: TenMinutes,
  });
};

export const getChooseProduct = (params: ParamsSearch) => {
  const { page, size, categoryIds, ...body } = params;
  return axiosClient.post<string, IPage<IItemProduct>>(
    `${API_PATHS.GET_CHOOSE_PRODUCT}?page=${page}&size=${size}`,
    {
      ...body,
      categoryIds: categoryIds ? [categoryIds] : [],
    }
  );
};

export const getChooseProductImport = (params: ParamsSearch) => {
  const { page, size, categoryIds, ...body } = params;
  return axiosClient.post<string, IPage<IItemProduct>>(
    `${API_PATHS.GET_CHOOSE_PRODUCT_IMPORT}?page=${page}&size=${size}`,
    {
      ...body,
      categoryIds: categoryIds ? [categoryIds] : [],
    }
  );
};

export const postFilterSerial = (data: ISerialItem[]) => {
  return axiosClient.post<string, ISerialItem[]>(API_PATHS.FILTER_SERIAL, data);
};

export const getDownloadFile = ({ uri, params }: IDownoadFile) => {
  return axiosClient.get<IDownoadFile, Blob>(uri, {
    params,
    responseType: 'blob',
  });
};

export const getProductCategory = () => {
  return axiosClient.get(`${API_PATHS.PRODUCT_CATEGORY}?page=0&size=9999999`);
};

export const getDetailTransaction = (id: string) => {
  return axiosClient.get<string, ITransaction>(
    `${API_PATHS.GET_DETAIL_TRANSACTION(id)}`
  );
};
