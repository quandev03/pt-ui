import { axiosClient } from 'apps/Internal/src/service';
import {
  IOrg,
  IProduct,
  ISerialLookup,
  ParamsSerialLookup,
  Req,
} from '../types';
import {
  prefixCatalogService,
  prefixResourceServicePublic,
  prefixSaleService,
} from '@react/url/app';

interface Res {
  content: ISerialLookup[];
  totalElements: number;
  size: number;
}

export const Serial = {
  getQRCodeImage: async (id: string) => {
    const res = await axiosClient.post<any>(
      `${prefixResourceServicePublic}/serial/qrcode`,
      id
    );
    if (!res || !res.data) throw new Error('Opps');
    return res.data;
  },
  getListOrg: async () => {
    const res = await axiosClient.get<any, IOrg[]>(
      `${prefixSaleService}/organization-user/get-all-organization-by-user`
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  getListProducts: async () => {
    const res = await axiosClient.get<any, IProduct[]>(
      `${prefixCatalogService}/product/search-products-for-import`
    );
    if (!res) throw new Error('Opps');
    return res;
  },

  getSerialList: async (param: ParamsSerialLookup) => {
    const res = await axiosClient.post<Req, Res>(
      `${prefixResourceServicePublic}/stock-product-serial?page=${param.page}&size=${param.size}`,
      {
        isDn: param.isDn,
        orgIds: param.orgIds?.split(','),
        productIds: param.productIds
          ? param.productIds.split(',').map(Number)
          : [],
        fromSerial: param.fromSerial,
        toSerial: param.toSerial,
        kitStatus: param.kitStatus,
        status: param.status,
      }
    );
    if (!res) throw new Error('Opps');
    return res;
  },
};
