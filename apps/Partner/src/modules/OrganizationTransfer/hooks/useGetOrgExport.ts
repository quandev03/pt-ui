import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { IWarehouse, ModalStatus } from '../types';
import { prefixSaleService } from '@react/url/app';
const queryKeyListWarehouseExport = 'query-list-warehouse-export';
const fetcher = async (getAll: boolean) => {
  const url = getAll
    ? `${prefixSaleService}/organization-user/get-all-authorized-partner-org`
    : `${prefixSaleService}/organization-user/get-all-authorized-partner-org?status=${ModalStatus.ACTIVE}`;
  const res = await axiosClient.get<any, IWarehouse[]>(url);
  return res;
};
export const useGetOrgExport = (getAll: boolean) => {
  return useQuery({
    queryKey: [queryKeyListWarehouseExport, getAll],
    queryFn: () => fetcher(getAll),
    select: (data) => data,
  });
};
