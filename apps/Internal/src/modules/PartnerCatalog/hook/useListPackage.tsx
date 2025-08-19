import { useQuery } from '@tanstack/react-query';
import { AnyElement, IOption, IPage } from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { IListOfServicePackage } from '../types';

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
    throw error;
  }
};

export const useListPackage = (params: AnyElement) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.LIST_OF_SERVICE_PACKAGE, params],
    queryFn: () => fetch(params),
    enabled: !!params,
    select(data) {
      const res: IOption[] = [];
      data.content.forEach((item) =>
        res.push({ label: item.pckName, value: item.pckCode })
      );
      return res;
    },
  });
};
