import { useQuery } from '@tanstack/react-query';
import { AnyElement, IPage } from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services';
import { IListOfServicePackage } from '../types';
import { prefixSaleService } from 'apps/Internal/src/constants';

const fetch = async (params: AnyElement) => {
  try {
    const res = (await safeApiClient.get)<IPage<IListOfServicePackage>>(
      `${prefixSaleService}/package-manager`,
      {
        params,
      }
    );
    return res;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const useList = (params: AnyElement) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.LIST_OF_SERVICE_PACKAGE, params],
    queryFn: () => fetch(params),
    enabled: !!params,
  });
};
