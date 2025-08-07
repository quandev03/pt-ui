import { useQuery } from '@tanstack/react-query';
import { AnyElement, IModeAction } from '@vissoft-react/common';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services';

const fetch = async (id: string) => {
  try {
    const res = await safeApiClient.get<AnyElement>(
      `${prefixSaleService}/package-manager/${id}`
    );
    return res;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const useView = (id: string, actionMode?: IModeAction) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.LIST_OF_SERVICE_PACKAGE_VIEW, id, actionMode],
    queryFn: () => fetch(id),
    enabled: !!id,
  });
};
