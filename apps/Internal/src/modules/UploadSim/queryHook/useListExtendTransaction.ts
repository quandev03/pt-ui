import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { GetListResponse } from '../../ListOfDepartment/types';

export interface ExtendTransactionItem {
  id: number;
  moveCode: number;
}
type Response = {
  data: GetListResponse<ExtendTransactionItem>;
};

const fetcher = async (value: string) => {
  return await axiosClient.get<Response>(
    `${prefixResourceService}/stock-product-serial-upload/search-uploadable-stock-move`, {
      params: {
        'value-search': value
      }
    }
  );
};

export const useListExtendTransaction = (value: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_EXTEND_TRANSACTION, value],
    queryFn: () => fetcher(value),
    select: (data: any) => data,
  });
};
