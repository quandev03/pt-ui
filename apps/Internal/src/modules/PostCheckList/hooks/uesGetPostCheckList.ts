import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { urlPostCheckList } from '../services/url';
import { IParamsPostCheckList, IPostCheckList } from '../types';
import { IPage } from '@react/commons/types';

const fetcher = async (params: IParamsPostCheckList) => {
  return axiosClient.get<IParamsPostCheckList, IPage<IPostCheckList>>(
    `${urlPostCheckList}/get-audit-sub-doc-list`,
    { params }
  );
};

export const useGetListPostCheckList = (params: IParamsPostCheckList) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_POST_CHECK_LIST, params],
    queryFn: () => fetcher(params),
    enabled: !!params.typeDate,
  });
};
