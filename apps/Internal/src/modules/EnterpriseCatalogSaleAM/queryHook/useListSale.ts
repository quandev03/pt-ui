import { useQuery } from '@tanstack/react-query';
import { ContentItem, GetListResponse, IUserRequestParams } from '../types';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';


type Response = {
  data: GetListResponse<ContentItem>;
};

const fetcher = async () => {
  return await axiosClient.get<Response>(
    `${prefixCustomerService}/sale-employee/get-all-sale-employee`,
  );
};

export const useSaleList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_SALES],
    queryFn: () => fetcher(),
    select: (data: any) => data,
  });
};
