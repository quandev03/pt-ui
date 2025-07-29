import { useMutation } from '@tanstack/react-query';
import useActiveSubscriptStore from '../store';
import { axiosClient } from 'apps/Partner/src/service';
import { prefixCustomerServicePublic } from '@react/url/app';

export interface Req {
  idKyc: string;
}

interface Res {
  publicKey: string;
  sessionToken: string;
  expiredAt: string;
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(
    `${prefixCustomerServicePublic}/gen-secret-key`,
    {
      params: body,
    }
  );
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
