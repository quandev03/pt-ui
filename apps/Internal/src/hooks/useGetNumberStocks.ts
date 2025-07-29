import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IPage } from '@react/commons/types';
import { INumberStock } from 'apps/Internal/src/app/types';
import { prefixCatalogServicePublic } from '@react/url/app';

export const fetcher = (types: number[] = [], requireAccess = true) => {
  // ? stockType = ${ id } & requireAccess = true;
  const params = new URLSearchParams();
  params.set('requireAccess', `${requireAccess}`);
  if (types) {
    types.forEach((type) => {
      params.append('stockType', `${type}`);
    });
  }
  return axiosClient.get<any, IPage<INumberStock>>(
    `${prefixCatalogServicePublic}/stock-isdn-org/find/by-stock-type`,
    { params: params }
  );
};

export const useGetNumberStocks = (
  types: number[] = [],
  requireAccess = true
) => {
  return useQuery({
    queryFn: () => fetcher(types, requireAccess),
    queryKey: ['GET_NUMBER_STOCKS', types, requireAccess],
    select: (data) => {
      return data.content.map((item: any) => {
        return {
          value: item.id,
          label: item.stockName,
        };
      });
    },
  });
};

export const useGetNumberStocksNoSelect = (
  types: number[] = [],
  requireAccess = true
) => {
  return useQuery({
    queryFn: () => fetcher(types, requireAccess),
    queryKey: ['GET_NUMBER_STOCKS_NO_SELECT', types, requireAccess],
    select: (data) => {
      return data.content;
    },
  });
};

export const fetcherPartner = () => {
  const params = new URLSearchParams();
  params.set('isVnsky', 'false');
  return axiosClient.get<any, IPage<INumberStock>>(
    `${prefixCatalogServicePublic}/stock-isdn-org/find/by-stock-type`,
    { params }
  );
};

export const useGetNumberStocksPartner = () => {
  return useQuery({
    queryFn: fetcherPartner,
    queryKey: ['useGetNumberStocksPartnerKey'],
    select: (data) => {
      return data.content.map((item: any) => {
        return {
          value: item.id,
          label: item.stockName,
        };
      });
    },
  });
};
