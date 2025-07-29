import {
  prefixCatalogService,
  prefixCatalogServicePublic,
} from '@react/url/app';
import { axiosClient } from 'apps/Partner/src/service';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
interface ParameterResquest {
  'table-name': string;
  'column-name': string;
  isIdValue?: boolean;
  enabled?: boolean;
}

export type Parameter = {
  code: string;
  id: number;
  value: string;
};

const fetcher = (params: ParameterResquest) => {
  return axiosClient.get<ParameterResquest, Parameter[]>(
    `/${prefixCatalogServicePublic}/parameter`,
    { params }
  );
};

export const useParameterQuery = ({
  isIdValue,
  enabled = true,
  ...params
}: ParameterResquest) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PARAMETER, params],
    staleTime: Infinity,
    enabled,
    select: (data) =>
      data?.map((e) => ({
        value: !isIdValue ? e.code : String(e.id),
        label: e.value,
        id: e.id,
      })),
  });
};
