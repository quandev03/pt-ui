import { useQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IUploadFormItem } from '../types';

const fetcher = (id?: string) => {
  return axiosClient.get<string, IUploadFormItem>(
    `${prefixResourceService}/stock-product-upload-order/${id}`
  );
};
export const useGetUploadFormDetail = (id?: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_UPLOAD_SIM_FORM_dETAIL, id],
    queryFn: () => fetcher(id),
    enabled: !!id,
  });
};
