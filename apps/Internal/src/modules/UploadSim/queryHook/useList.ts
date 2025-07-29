import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ContentItem, IUploadSimParams } from '../types';
import { GetListResponse } from '../../ListOfDepartment/types';

type Response = {
  data: GetListResponse<ContentItem>;
};

const fetcher = async (params: IUploadSimParams) => {
  return await axiosClient.get<Response>(`${prefixResourceService}/stock-product-serial-upload/search`, {params});
};

export const useList = (params: IUploadSimParams) => {
  return useQuery({
    enabled: !!params.startDate,
    queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_SIM, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
  });
};
