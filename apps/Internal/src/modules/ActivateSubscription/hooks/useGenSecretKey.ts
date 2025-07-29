import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';

export interface Req {
  idKyc: string;
}

interface Res {
  publicKey: string;
  sessionToken: string;
  expiredAt: string;
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(`${prefixCustomerService}/gen-secret-key`, {
    params: body,
  });
};

export const useGenSecretKey = () => {
  const { formAntd } = useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      formAntd.setFieldsValue({
        publicKey: data.publicKey,
        sessionToken: data.sessionToken,
      });
    },
  });
};
