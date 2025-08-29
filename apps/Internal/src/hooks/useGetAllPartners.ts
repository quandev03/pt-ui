import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../constants/query-key';
import { apiUtils, safeApiClient } from '../services';
import { prefixSaleService } from '../constants';
import { IOrgItem } from '../types';

const getOrganizationUnit = async () => {
  return await safeApiClient.get<IOrgItem[]>(
    `${prefixSaleService}/esim-manager/organization-unit`
  );
};
export const useGetAllOrganizationUnit = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ORGANIZATION_UNIT],
    queryFn: () => getOrganizationUnit(),
    select(data) {
      return apiUtils.mapStockParent(apiUtils.convertArrToObj(data, null));
    },
  });
};
