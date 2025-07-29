import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../service';
import { prefixCatalogService } from '@react/url/app';

export enum ReasonCodeType {
  INTERNAL_IMPORT_EXPORT = 'INTERNAL_IMPORT_EXPORT',
  NCC_IMPORT_EXPORT = 'NCC_IMPORT_EXPORT',
  NPP_IMPORT_EXPORT = 'NPP_IMPORT_EXPORT',
  CANCEL_SIM_REGISTRATION = 'CANCEL_SIM_REGISTRATION',
}

interface IReasonRequest {
  reasonTypeCode: ReasonCodeType;
  status?: number;
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
const fetcher = async (params: IReasonRequest) => {
  const res = await axiosClient.get<string, IReasonResponse[]>(
    `${prefixCatalogService}/reason/search-by-reason-code`,
    { params }
  );
  if (!res) throw new Error('Oops');
  return res;
};
export const useListReasonByCode = (
  params: IReasonRequest,
  reasonId = undefined,
  enabled = true
) => {
  return useQuery({
    queryKey: ['catalog-service-get-reason-by-code', params],
    queryFn: () => fetcher(params),
    staleTime: Infinity,
    select: (data) =>
      data
        ?.filter((c) => c.status || c.reasonId === reasonId) //get status active
        ?.map((e) => ({
          value: e.reasonId,
          label: `${e.reasonCode}_${e.reasonName} ${
            e.status ? '' : '(Ngưng hoạt động)'
          }`,
        })),
    enabled,
  });
};
