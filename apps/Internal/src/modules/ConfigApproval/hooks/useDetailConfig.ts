import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ConfigApprovalType } from '../types';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

export interface FilterGetOtp {
  isdn: string;
  idEkyc: string;
  otpType: string;
  transactionId: string;
}

export const queryKeyDetailConfig = 'query-detail-config-approval';

const fetcher = (id: string | undefined) => {
  return axiosClient.get<string, ConfigApprovalType>(
    `${prefixApprovalService}/approval-process/${id}`
  );
};

export const useDetailConfig = (id: string | undefined) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyDetailConfig, id],
    select: (data: ConfigApprovalType) => data,
    enabled: !!id,
  });
};
