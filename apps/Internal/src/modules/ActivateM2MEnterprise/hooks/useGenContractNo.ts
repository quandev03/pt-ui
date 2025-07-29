import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import { useGenContract } from './useGenContract';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useActivateM2M from '../store';

export interface Req {
  idNo: string;
  activeType: SignEnum;
}

export enum SignEnum { //1 là Online, 2 là offline
  ONLINE = '1',
  OFFLINE = '2',
}

interface Res {
  contractNo: string;
}

const fetcher = () => {
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/gen-contract-no-m2m`
  );
};

export const useGenContractNo = () => {
  const { formAntd: form, setIsGenCode } = useActivateM2M();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, variables) => {
      form.setFieldsValue({
        contractNoM2M: data?.contractNo,
      });
      setIsGenCode(false)
    },
  });
};
