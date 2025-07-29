import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ContentItem, IUploadSimParams } from '../types';
import { GetListResponse } from '../../ListOfDepartment/types';

export interface UploadOrderItem {
    id: number;
    uploadOrderNo: string;
    poNo: string;
    amountNumber: number;
    approvalStatus: number;
    orderStatus: number;
}
type Response = {
  data: GetListResponse<UploadOrderItem>;
};

const fetcher = async (value: string) => {
  return await axiosClient.get<Response>(`${prefixResourceService}/stock-product-upload-order/search-for-uploading-sim`, {
    params: {
      'value-search': value
    }
  });
};

export const useListUploadOrder = (value: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_ORDER_NO, value],
    queryFn: () => fetcher(value),
    select: (data: any) => data,
  });
};
