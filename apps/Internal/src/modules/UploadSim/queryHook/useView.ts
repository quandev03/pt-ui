import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = async (id: string) => {
  return await axiosClient.get<any>(`${prefixResourceService}/stock-product-serial-upload/${id}`);
};

export const useView = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_SIM, id],
    queryFn: () => fetcher(id),
    select: (data: any) => data,
  });
};
