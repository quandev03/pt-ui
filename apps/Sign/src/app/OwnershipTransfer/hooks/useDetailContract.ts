import {
  prefixCustomerService,
  prefixCustomerServicePublic,
} from '@react/url/app';
import { downloadFilePdf } from '@react/utils/handleFile';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Sign/src/service';

export enum ContractTypeEnum {
  XAC_NHAN = 1,
  YEU_CAU = 2,
  CAM_KET = 3,
  ND13 = 4,
}

export const queryKeyDetailContract = 'query-detail-ownership-transfer';

export interface ParamDetailContract {
  id: string | null;
  isSign: boolean;
  typeContract: ContractTypeEnum;
  fileName?: string;
}

const fetcher = (
  { id, ...params }: ParamDetailContract,
  isPublicWeb = false
) => {
  return axiosClient.get<any, any>(
    `${
      isPublicWeb ? prefixCustomerServicePublic : prefixCustomerService
    }/change-information/contract/${id}`,
    { responseType: 'blob', params }
  );
};

export const useDetailContract = (param: ParamDetailContract) => {
  return useQuery({
    queryFn: () => fetcher(param),
    queryKey: [queryKeyDetailContract, param],
    enabled: !!param.id,
  });
};

export const useDetailPublicContract = (param: ParamDetailContract) => {
  return useQuery({
    queryFn: () => fetcher(param, true),
    queryKey: [queryKeyDetailContract, param],
    enabled: !!param.id,
  });
};

export const useMutateDetailContract = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, { fileName }) => downloadFilePdf(data, fileName),
  });
};
