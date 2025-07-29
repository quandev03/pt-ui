import { IPage } from '@react/commons/types';
import { prefixCatalogServicePublic, prefixSaleService } from '@react/url/app';
import { axiosClient } from 'apps/Partner/src/service';
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
  IPayloadCreateOrder,
  IProductInOrder,
  IResGetFile,
} from '../types';

export const OrderService = {
  getOrders: (params: IOrderParams) => {
    return axiosClient.get<IOrderParams, IPage<IOrder>>(
      `${prefixSaleService}/sale-orders`,
      {
        params,
      }
    );
  },
  getOrdersDetail: (id: string) => {
    return axiosClient.get<string, IDataOrder>(
      `${prefixSaleService}/sale-orders/${id}`
    );
  },
  getArea: (parentId?: string | number) => {
    return axiosClient.get<string, Cadastral[]>(
      `${prefixCatalogServicePublic}/area?parentId=${parentId}`
    );
  },
  getCalculateDiscount: (payload: ICalculateDiscountPayload) => {
    return axiosClient.post<string, ICalculateDiscountData>(
      `${prefixSaleService}/sale-orders/calculate-discount`,
      payload
    );
  },
  getProductOrder: (params: IParamsProduct) => {
    return axiosClient.get<string, IPage<IProductInOrder>>(
      `${prefixSaleService}/sale-orders/list-product`,
      { params }
    );
  },
  getProductType: () => {
    return axiosClient.get<string, ICategoryProduct[]>(
      `${prefixSaleService}/sale-orders/list-category`
    );
  },
  getFileOrder: (params: IFileDetailOrder) => {
    return axiosClient.get<IFileDetailOrder, IResGetFile[]>(
      `${prefixSaleService}/attachments`,
      { params }
    );
  },
  getFileOrderDownload: async (payload: { id: number; fileName: string }) => {
    const res = await axiosClient.get<string, Blob>(
      `${prefixSaleService}/files/${payload.id}`,
      {
        responseType: 'blob',
      }
    );
    return res;
  },
  updateStatusOrder: (payload: {
    id: number | string;
    status: StatusOrderEnum;
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
  getESimFile: (payload: { id: number | string; fileName: string }) => {
    return axiosClient.get<string, Blob>(
      `${prefixSaleService}/sale-orders/generate-qr?id=${payload.id}`,
      {
        responseType: 'blob',
      }
    );
  },
};
