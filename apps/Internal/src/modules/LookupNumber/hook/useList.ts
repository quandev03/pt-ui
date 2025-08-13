import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services/axios';
import { IParameter, IResLookupNumber } from '../types';
import { IPage } from '@vissoft-react/common';

const fetch = async (params: IParameter) => {
  try {
    const res = await safeApiClient.get<IPage<IResLookupNumber>>(
      `${prefixSaleService}/subscriber`,
      {
        params,
      }
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const useList = (params: IParameter) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LOOKUP_NUMBER, params],
    queryFn: () => fetch(params),
  });
};
