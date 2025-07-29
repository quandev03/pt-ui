import { IPage, IParamsRequest } from '@react/commons/types';
import { getParamsString } from '@react/helpers/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IOrderItem } from '../types';

const fetcher = (body: IParamsRequest) => {
  const queryParam = getParamsString(body);
  return axiosClient.get<any, IPage<IOrderItem>>(
    `${prefixResourceService}/stock-product-upload-order/search-uploadable-delivery-order?${queryParam}`
  );
};
export const useInfinityScrollPO = (body: IParamsRequest) => {
  return useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.GET_INFINITY_PO, body],
    queryFn: ({ pageParam }) => fetcher({ ...body, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    select: (data) => {
      const { pages } = data;
      const result: {
        label: string;
        value: number;
        orderNo: string;
      }[] = [];
      pages.forEach((item) => {
        item.content.forEach((order) => {
          result.push({
            label: order.orderNo + ' - ' + order.supplierName,
            value: order.id,
            orderNo: order.orderNo,
          });
        });
      });
      return result;
    },
  });
};
