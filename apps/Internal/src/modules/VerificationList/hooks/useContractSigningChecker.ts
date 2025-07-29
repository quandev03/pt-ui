import { NotificationSuccess } from '@react/commons/Notification';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useCensorshipStore from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useGetPathFileSignNew } from './useGetPathFileSignNew';

export interface Res {
  signed: boolean;
}

export interface Req {
  contractId: string;
  key: TypePDF;
  timeStampContract: string;
}

export enum TypePDF {
  HD = 'HD',
  ND13 = 'ND13',
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(
    `${prefixCustomerService}/contract-signing-checker-approve/${body.contractId}?timeStampContract=${body.timeStampContract}`
  );
};

export const useContractSigningChecker = () => {
  const {
    formAntd: form,
    setSignND13Success,
    setIsSignSuccess,
    setIsDisabledContract,
    interval,
  } = useCensorshipStore();
  const { mutate: mutateGetPathFileSignNew } = useGetPathFileSignNew();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      const contractId = form.getFieldValue('contractId');
      if (contractId) mutateGetPathFileSignNew(contractId);
      if (data.signed === true) {
        form.setFields([
          { name: 'fileND13', value: 'Biên_bản_xác_nhận_NĐ13', errors: [] },
          {
            name: 'cardContract',
            errors: [],
          },
        ]);
        setSignND13Success(true);
        setIsSignSuccess(true);
        setIsDisabledContract(true);
        NotificationSuccess('Ký hợp đồng thành công');
        clearInterval(interval);
        form.setFieldValue('isResetImage', false);
      }
    },
  });
};
