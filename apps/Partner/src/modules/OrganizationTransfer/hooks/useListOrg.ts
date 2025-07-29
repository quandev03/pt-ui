import { useMutation, useQuery } from '@tanstack/react-query';
import { OrgTransferType } from '../types';
import { prefixSaleService } from '@react/url/app';
import { axiosClient } from 'apps/Partner/src/service';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';

export interface Req {
  fromDate?: string;
  toDate?: string;
  page: number;
  size: number;
  orgId?: number;
  ieOrgId?: number;
}

interface Res {
  content: OrgTransferType[];
  totalElements: number;
  size: number;
  page: number;
}

export const queryKeyListOrg = 'query-list-organization-transfer';
const fetcher = (params: Req) => {
  const customParams = {
    fromDate: params.fromDate ? dayjs(params.fromDate).format(DateFormat.DATE_ISO) : dayjs().subtract(29, 'day').format(DateFormat.DATE_ISO),
    toDate: params.toDate ? dayjs(params.toDate).format(DateFormat.DATE_ISO) : dayjs().endOf('day').format(DateFormat.DATE_ISO),
    page: params.page,
    size: params.size,
    orgId: params.orgId ?? undefined,
    ieOrgId: params.ieOrgId ?? undefined,
  }
  return axiosClient.get<Req, Res>(`${prefixSaleService}/transfer-stock-move`, {
    params: customParams,
  });
};

export const useListOrgTransfer = (params: any) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [queryKeyListOrg, params],
    select: (data: Res) => data,
    enabled: true,
  });
};
