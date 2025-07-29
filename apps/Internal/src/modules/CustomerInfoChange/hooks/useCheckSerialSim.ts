import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { useFetchStatusSubscription } from './useStatusSubscription';

export interface ParamSerialSim {
  serial: string;
  isdn: string;
  type: number;
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
    `${prefixCustomerService}/change-information/check-isdn-ownership-transfer`,
    {
      params: body,
    }
  );
};

export const useCheckSerialSim = () => {
  const {
    formAntd: form,
    setSuccessIsdn,
    setOtpStatus,
  } = useActiveSubscriptStore();
  const { mutate: subscriptionStatus } = useFetchStatusSubscription();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res, variables) => {
      subscriptionStatus(variables);
      setOtpStatus(0);
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field !== 'isdn' ? item.field : 'phone',
            errors: [item.detail],
          }))
        );
      }
      setSuccessIsdn(false);
      form.resetFields([
        'cardFront',
        'cardBack',
        'portrait',
        'cardContract',
        'otpStatus',
        'videoCallStatus',
        'videoCallUser',
        'approveStatus',
        'assignUserName',
        'approveNumber',
        'approveReason',
        'approveNote',
        'approveDate',
        'auditStatus',
        'auditReason',
      ]);
      form.setFieldsValue({
        pkName: '',
        checkSimError: err?.detail,
      });
    },
  });
};
