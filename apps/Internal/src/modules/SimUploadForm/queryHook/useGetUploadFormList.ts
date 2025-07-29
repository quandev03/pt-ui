import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ISimUploadFormItem, ISimUploadFormParams } from '../types';

const fetcher = (params: ISimUploadFormParams) => {
  return axiosClient.get<ISimUploadFormParams, IPage<ISimUploadFormItem>>(
    `${prefixResourceService}/stock-product-upload-order/search`,
    { params }
  );
};
export const useGetUploadFormList = (params: ISimUploadFormParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_UPLOAD_SIM_FORM_LIST, params],
    queryFn: () => fetcher(params),
  });
};
