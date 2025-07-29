import { AnyElement } from '@react/commons/types';
import { prefixCatalogService } from '@react/url/app';
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
const queryKeyList = 'list-package';
const fetcher = async (params: AnyElement) => {
  const res = await axiosClient.get<any, any>(
    `${prefixCatalogService}/package-profile/get-web-app-vnksy-packages`,
    {
      params: params,
    }
  );
  return res;
};
export const useGetListPackage = (params: AnyElement) => {
  return useInfiniteQuery({
    queryKey: [queryKeyList, params],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher({ ...params, page: pageParam });
    },
    select: (data) => {
      const { pages } = data;
      const result: any[] = [];
      pages.forEach((item) => {
        item.content.forEach((product: any) => {
          result.push(product);
        });
      });
      return result.map((items) => {
        return {
          value: items.pckCode,
          label: items.pckCode,
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
export default useGetListPackage;
