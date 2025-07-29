import { IPage } from "@react/commons/types";
import { prefixCatalogServicePublic } from "@react/url/app";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "apps/Partner/src/service";
import { INumberStock } from "../type";
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