import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { useActiveSubscriptStore } from '../store';
import { useGenContract } from './useGenContract';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { FormInstance } from 'antd';
import { ActionType } from '@react/constants/app';

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

const fetcher = (data: Req) => {
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/gen-contract-no`,
    null,
    {
      params: data,
    }
  );
};

export const useGenContractNo = (
  form: FormInstance,
  typeModal?: ActionType
) => {
  const { deviceToken, interval } = useActiveSubscriptStore();
  const { mutate: mutateGenContract } = useGenContract(form, typeModal);
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, variables) => {
      form.setFieldsValue({
        contractNo: data?.contractNo,
      });
      clearTimeout(interval);
      mutateGenContract({
        ...form.getFieldsValue(),
        contractNo: data?.contractNo,
        type: variables.activeType === SignEnum.ONLINE ? 'PNG' : 'PDF', //1 là Online, 2 là offline
        deviceToken:
          variables.activeType === SignEnum.ONLINE ? deviceToken : undefined,
      });
    },
  });
};
