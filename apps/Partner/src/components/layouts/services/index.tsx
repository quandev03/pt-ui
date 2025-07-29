import {
  GetALLData,
  IAllParamResponse,
  IPartnerInfor,
  IUserInfo,
} from '../types';

import {
  IPage,
  IPageRequestListTable,
  MenuObjectItem,
} from '@react/commons/types';
import { getParamsString } from '@react/helpers/utils';
import { OidcClientCredentials } from 'apps/Partner/src/constants';
import {
  baseApiUrl,
  prefixAuthServicePublic,
} from 'apps/Partner/src/constants/app';
import { axiosClient } from 'apps/Partner/src/service';
import axios from 'axios';
import { prefixCatalogServicePublic, prefixSaleService } from '@react/url/app';

export const LayoutService = {
  getMenu: async () => {
    const res = await axiosClient.get<string, MenuObjectItem[]>(
      `${prefixAuthServicePublic}/api/auth/menu/flat`
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  getParamsOption() {
    return axiosClient.get<string, IAllParamResponse>(
      `${prefixSaleService}/params`
    );
  },
  getPartnerInfor: async (params?: { vnskyInfo: boolean }) => {
    const res = await axiosClient.get<string, IPartnerInfor>(
      `${prefixCatalogServicePublic}/organization-partner/info`,
      {
        params,
      }
    );
    return res;
  },
  getFileDownloadSaleService: async (payload: {
    id: number;
    fileName: string;
  }) => {
    const res = await axiosClient.get<string, Blob>(
      `${prefixSaleService}/files/${payload.id}`,
      {
        responseType: 'blob',
      }
    );
    return res;
  },
  getDataTableByDomain: async <T,>({
    queryKey,
  }: {
    queryKey: [string, IPageRequestListTable];
  }) => {
    const { domain, ...params } = queryKey[1];
    const stringParams = getParamsString(params);
    const res = await axiosClient.get<string, IPage<T>>(
      `${prefixAuthServicePublic}/api/search/${domain}?${stringParams}`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  logout: async (refreshToken: string) => {
    const formReq = new URLSearchParams();
    formReq.append('token', refreshToken);
    const res = await axios.post<string, void>(
      `${prefixAuthServicePublic}/oauth2/revoke`,
      formReq,
      {
        baseURL: baseApiUrl as string,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            OidcClientCredentials.clientId +
              ':' +
              OidcClientCredentials.clientSecret
          )}`,
        },
      }
    );
    return res;
  },
  getAllRoles: async () => {
    const res = await axiosClient.get<string, GetALLData[]>(
      `${prefixAuthServicePublic}/api/roles/all`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getProfile: async () => {
    return await axiosClient.get<string, IUserInfo>(
      `${prefixAuthServicePublic}/api/auth/profile`
    );
  },
};
