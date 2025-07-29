import { IPage } from '@react/commons/types';
import {
  prefixCatalogService,
  prefixCatalogServicePublic,
  prefixSaleService,
} from '@react/url/app';
import { downloadFile } from '@react/utils/handleFile';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { StatusOrderEnum } from '../constants';
import {
  Cadastral,
  ICalculateDiscountData,
  ICalculateDiscountPayload,
  ICategoryProduct,
  IDataOrder,
  IFileDetailOrder,
  IOrder,
  IOrderParams,
  IParamsProduct,
  IPartnerInfor,
  IPayloadCreateOrder,
  IProductInOrder,
  IResGetFile,
} from '../types';

export const OrderService = {
  getOrders: async (params: IOrderParams) => {
    const res = await axiosClient.get<IOrderParams, IPage<IOrder>>(
      `${prefixSaleService}/sale-orders`,
      {
        params: {
          ...params,
        },
      }
    );
    return res;
  },
  getOrdersDetail: (id: string) => {
    return axiosClient.get<string, IDataOrder>(
      `${prefixSaleService}/sale-orders/${id}`
    );
  },
  getArea: (parentId?: string | number) => {
    return axiosClient.get<any, Cadastral[]>(
      `${prefixCatalogService}/area?parentId=${parentId}`
    );
  },
  getCalculateDiscount: (payload: ICalculateDiscountPayload) => {
    return axiosClient.post<any, ICalculateDiscountData>(
      `${prefixSaleService}/sale-orders/calculate-discount`,
      payload
    );
  },
  getProductOrder: (params: IParamsProduct) => {
    return axiosClient.get<any, IPage<IProductInOrder>>(
      `${prefixSaleService}/sale-orders/list-product`,
      { params }
    );
  },
  getProductType: () => {
    return axiosClient.get<any, ICategoryProduct[]>(
      `${prefixSaleService}/sale-orders/list-category`
    );
  },
  getFileOrder: (params: IFileDetailOrder) => {
    return axiosClient.get<IFileDetailOrder, IResGetFile[]>(
      `${prefixSaleService}/attachments`,
      { params }
    );
  },
  updateStatusOrder: ({
    id,
    status,
  }: {
    id: number;
    status: StatusOrderEnum;
  }) => {
    return axiosClient.put<IFileDetailOrder, any>(
      `${prefixSaleService}/sale-orders/${id}?status=${status}`
    );
  },
  updateStatusOrderAdmin: (payload: {
    id: number;
    status: StatusOrderEnum;
    description: string;
  }) => {
    return axiosClient.put<IFileDetailOrder, any>(
      `${prefixSaleService}/sale-orders`,
      {
        ...payload,
        status: Number(payload.status),
      }
    );
  },
  createOrder: (payload: IPayloadCreateOrder) => {
    const formData = new FormData();
    formData.append(
      'saleOrderDTO',
      new Blob([JSON.stringify(payload.saleOrderDTO)], {
        type: 'application/json',
      })
    );
    formData.append(
      'attachmentMetadata',
      new Blob([JSON.stringify(payload.attachmentMetadata)], {
        type: 'application/json',
      })
    );

    payload.attachmentFile.forEach((item) => {
      formData.append('attachmentFile', item as Blob);
    });
    return axiosClient.post<IPayloadCreateOrder, IDataOrder>(
      `${prefixSaleService}/sale-orders`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
  getPartnerInfor: async (params?: { vnskyInfo: boolean }) => {
    const res = await axiosClient.get<any, IPartnerInfor>(
      `${prefixCatalogServicePublic}/organization-partner/info`,
      {
        params,
      }
    );
    return res;
  },
  downloadReport: async ({
    payload,
    url,
  }: {
    payload: Record<string, string>;
    url: string;
  }) => {
    const res = await axiosClient.get<string, AxiosResponse<Blob>>(url, {
      params: { ...payload, page: undefined, size: undefined },
      responseType: 'blob',
    });
    downloadFile(res.data, 'Bao_cao_đon_đat_hang.xlsx'); // srs fix cứng tên
    return res;
  },
};
