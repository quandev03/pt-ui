import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services';

const fetch = async (id: string) => {
  try {
    const res = await safeApiClient.get(
      `${prefixSaleService}/package-manager/${id}`
    );
    return res;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const useView = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.LIST_OF_SERVICE_PACKAGE_VIEW, id],
    queryFn: () => fetch(id),
    enabled: !!id,
  });
};
