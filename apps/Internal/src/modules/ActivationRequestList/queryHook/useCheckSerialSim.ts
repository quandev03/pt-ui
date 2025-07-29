import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService} from 'apps/Internal/src/constants/app';
import { FormInstance } from 'antd';

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
    `${prefixCustomerService}/check-sim-active-status`,
    {
      params: body,
    }
  );
};

export const useCheckSerialSim = (form: FormInstance) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      form.setFieldsValue({
        pkName: res.pckName,
      });
    },
    onError: () => {
      form.setFieldsValue({
        pkName: '',
      });
    },
  });
};
