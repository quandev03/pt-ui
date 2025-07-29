import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useOwnershipTransferStore from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useGenContract } from './useGenContract';
import { ContractTypeEnum } from './useDetailContract';

export interface Req {
  idNo: string;
  activeType: SignEnum;
  contractType: ContractTypeEnum | undefined;
}

export enum SignEnum { //1 là Online, 2 là offline
  ONLINE = '1',
  OFFLINE = '2',
}

interface Res {
  contractNo: string;
}

const fetcher = (data: Req) => {
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/gen-contract-no`,
    null,
    {
      params: data,
    }
  );
};

export const useGenContractNo = () => {
  const { formAntd: form, setIsChangeInfoOcr } = useOwnershipTransferStore();
  const { mutate: mutateGenContract } = useGenContract();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, { contractType, activeType }) => {
      form.setFieldValue('contractNo', data?.contractNo);
      setIsChangeInfoOcr(true);
      mutateGenContract({
        ...form.getFieldsValue(),
        contractNo: data?.contractNo,
        activeType,
        contractType,
      });
    },
  });
};
