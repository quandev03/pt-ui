import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixResourceService } from '@react/url/app';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';

const fetcher = (params?: any) => {
  return axiosClient.get<string, IPage<INumberTransactionDetail>>(
    `${prefixResourceService}/classify-special-number`,
    {
      params,
    }
  );
};

export const useListClassifySpecialNumber = (params?: any) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_CLASSIFY_SPECIAL_NUMBER, params],
    queryFn: () => fetcher(params),
  });
};
