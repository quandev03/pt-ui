import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import useCensorshipStore from '../store';

export interface Res {
  signed: boolean;
}

export interface Req {
  contractId: string;
  key: TypePDF;
  timeStampContract: string;
}

export enum TypePDF {
  HD = 'HD',
  ND13 = 'ND13',
}

const fetcher = async (contractId: Req) => {
  const path = await axiosClient.get<string, string>(
    `${prefixCustomerService}/new-contract-path?contractNo=${contractId}`
  );
  return path;
};

export const useGetPathFileSignNew = () => {
  const { setNewSignContractUrl } = useCensorshipStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      setNewSignContractUrl(data);
    },
  });
};
