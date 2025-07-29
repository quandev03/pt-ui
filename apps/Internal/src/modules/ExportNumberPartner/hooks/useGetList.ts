import { IPage, IParamsRequest } from '@react/commons/types';
import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (params: IParamsRequest) => {
  return axiosClient.get<string, IPage<any>>(
    `${prefixResourceService}/export-number-for-partner`,
    {
      params: {
        ...params,
        filters: undefined,
      },
    }
  );
};

export const useGetList = (params: IParamsRequest) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ExportNumberPartnerKey, params],
    queryFn: () => fetcher(params),
  });
};
