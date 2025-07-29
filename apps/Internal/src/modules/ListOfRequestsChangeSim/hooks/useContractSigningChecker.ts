import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreListOfRequestsChangeSim from '../store';
import { NotificationSuccess } from '@react/commons/Notification';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface Res {
  signed: boolean;
}

export interface Req {
  contractId: string;
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(
    `${prefixCustomerService}/contract-signing-checker/${body.contractId}`
  );
};

export const useContractSigningChecker = () => {
  const {
    formAntd: form,
    setSignSuccess,
    setIsDisabledContract,
    interval,
  } = useStoreListOfRequestsChangeSim();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      if (data.signed === true) {
        form.setFields([
          {
            name: 'cardContract',
            errors: [],
          },
        ]);

        setSignSuccess(true);
        setIsDisabledContract(true);
        NotificationSuccess('Ký thành công');
        clearTimeout(interval);
      }
    },
  });
};
