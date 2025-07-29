import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { IStockIn } from '../type';
const queryKey = 'GET_STOCK_OUT_INTERNAL_WAREHOUSE_DELIVERY_NOTE';
const fetcher = async () => {
  const res = await axiosClient.get<string, IStockIn>(
    `${prefixSaleService}/organization-user/get-organization-current`
  );
  return res;
};
const useGetStockIn = (enabled: boolean) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: fetcher,
    select: (data) => (data.status === 1 ? data.id : null),
    enabled: enabled,
  });
};
export default useGetStockIn;
