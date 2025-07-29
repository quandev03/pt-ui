import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService, prefixCustomerService } from '../constants/app';
import { axiosClient } from '../service';

export enum ReasonType {
  INTERNAL_IMPORT_EXPORT = '1',
  NCC_IMPORT_EXPORT = '2',
  NPP_IMPORT_EXPORT = '3',
  CANCEL_SIM_TRANS = '8',
}

interface IReasonResponse {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  reasonId: number;
  reasonTypeCode: string;
  reasonTypeName: string;
  reasonCode: string;
  reasonName: string;
  status: number;
}
const fetcher = async (type: string) => {
  const res = await axiosClient.get<string, IReasonResponse[]>(
    `${prefixCatalogService}/reason/get-reason-by-type?reasonTypeId=${type}`
  );
  if (!res) throw new Error('Oops');
  return res;
};
export const useListReasonByType = (type: string, enabled = true) => {
  return useQuery({
    queryKey: ['catalog-service-get-reason-by-type', type],
    queryFn: () => fetcher(type),
    staleTime: Infinity,
    select: (data) =>
      data
        ?.filter((c) => c.status === 1) //get status active
        ?.map((e) => ({
          value: e.reasonId,
          label: `${e.reasonCode}_${e.reasonName}`,
        })),
    enabled: !!type && enabled,
  });
};
