import { axiosClient } from 'apps/Partner/src/service';
import {
  IOrg,
  IProduct,
  ISerialLookup,
  ParamsSerialLookup,
  Req,
} from '../types';
import {
  prefixCatalogServicePublic,
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
    const params = {
      page: 0,
      size: 2000,
    } 
    const res = await axiosClient.get<IProduct[],any>(
      `${prefixCatalogServicePublic}/product/search-authorized-products-of-org`,
      {params}
    );
    if (!res) throw new Error('Opps');
    return res.content;
  },
  getSerialList: async (param: ParamsSerialLookup) => {
    const res = await axiosClient.post<Req, Res>(
      `${prefixResourceServicePublic}/stock-product-serial?page=${param.page}&size=${param.size}`,
      {
        isDn: param.isDn,
        orgIds: param.orgIds?.split(','),
        productIds: param.productIds?.split(','),
        fromSerial: param.fromSerial,
        toSerial: param.toSerial,
        status: param.status,
        kitStatus: param.kitStatus,
      }
    );
    if (!res) throw new Error('Opps');
    return res;
  },
};
