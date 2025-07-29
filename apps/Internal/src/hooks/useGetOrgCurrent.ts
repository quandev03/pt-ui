import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixSaleService } from '../constants/app';
import { REACT_QUERY_KEYS } from '../constants/querykeys';
import { IWarehouseExport } from '../modules/StockOutForDistributor/type';

const fetcher = () => {
  return axiosClient.get<IWarehouseExport, any>(
    `${prefixSaleService}/organization-user/get-organization-current`
  );
};

export const useGetOrgCurrent = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_WAREHOUSE_EXPORT],
    queryFn: fetcher,
    select: (data) => data,
  });
};
