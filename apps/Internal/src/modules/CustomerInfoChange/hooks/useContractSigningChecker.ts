import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import { NotificationSuccess } from '@react/commons/Notification';
import { values } from 'lodash';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface Res {
  signed: boolean;
}

export interface Req {
  contractId: string;
  key: TypePDF;
}

export enum TypePDF {
  HD = 'HD',
  ND13 = 'ND13',
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(
    `${prefixCustomerService}/contract-signing-checker/${body.contractId}`
  );
};

export const useContractSigningChecker = () => {
  const {
    formAntd: form,
    setSignND13Success,
    setSignSuccess,
    setIsDisabledContract,
    setIsDisabledCommit,
    interval,
  } = useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, variables) => {
      if (data.signed === true) {
        form.setFields([
          { name: 'fileND13', value: 'Biên_bản_xác_nhận_NĐ13', errors: [] },
          {
            name: 'cardContract',
            errors: [],
          },
        ]);
        setSignND13Success(true);
        setSignSuccess(true);
        setIsDisabledContract(true);
        setIsDisabledCommit(true);
        NotificationSuccess('Ký thành công');
        clearTimeout(interval);
      }
    },
  });
};
