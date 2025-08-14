import { useInfiniteQuery } from '@tanstack/react-query';
import { AnyElement, IParamsRequest } from '@vissoft-react/common';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services';

const fetcher = async (params: IParamsRequest) => {
  const res = await safeApiClient.get<AnyElement>(
    `${prefixSaleService}/organization-partner/all-partner`,
    {
      params,
    }
  );
  return res;
};

export const useGetAllOrg = (params: IParamsRequest) => {
  return useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ORG, params],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher({ ...params, page: pageParam });
    },
    select: (data) => {
      const { pages } = data;
      const result: any[] = [];
      pages.forEach((item) => {
        item.forEach((org: any) => {
          result.push(org);
        });
      });
      return result.map((items) => {
        return {
          value: items.orgCode,
          label: items.orgName,
        };
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};
