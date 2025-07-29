import { CommonError } from '@react/commons/types';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import useActiveSubscriptStore from '../store';

export interface ParamSerialSim {
  serial: string;
  isdn: string;
}

interface Res {
  apiCode: string;
  apiPromCode: string;
  imsi: null;
  isdn: string;
  kitProductId: number;
  pckCode: null;
  pckName: null;
  pkCode: string;
  pkName: string;
  profileType: string;
  registerDate: null;
  serial: string;
  smsCode: string;
}

const fetcher = (body: ParamSerialSim) => {
  return axiosClient.get<ParamSerialSim, Res>(
    `${prefixCustomerServicePublic}/check-sim-active-status`,
    {
      params: body,
    }
  );
};

export const useCheckSerialSim = () => {
  const { formAntd: form } = useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      form.setFieldsValue({
        pkName: res.pckName,
      });
    },
    onError: (err: CommonError) => {
      form.setFieldsValue({
        pkName: '',
        checkSimError: err?.detail,
      });
    },
  });
};
