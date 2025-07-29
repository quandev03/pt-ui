import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useOwnershipTransferStore from '../store';
import { NotificationSuccess } from '@react/commons/Notification';
import { values } from 'lodash';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { ContractTypeEnum, useDetailContract } from './useDetailContract';

export interface Res {
  transferorSigning: boolean;
  transfereeSigning: boolean;
}

export interface Req {
  contractId: string;
}

export enum TypePDF {
  HD = 'HD',
  ND13 = 'ND13',
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(
    `${prefixCustomerService}/change-information/contract-signing-checker/${body.contractId}`
  );
};

export const useContractSigningChecker = () => {
  const {
    formAntd: form,
    setSignND13Success,
    setSignSuccess,
    setTransfereeSignSuccess,
    setOfflineCreatedList,
    interval,
  } = useOwnershipTransferStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: async ({ transferorSigning, transfereeSigning }) => {
      if (transferorSigning && transfereeSigning) {
        form.setFields([
          { name: 'fileND13', value: 'Biên_bản_xác_nhận_NĐ13', errors: [] },
          {
            name: 'cardContract',
            errors: [],
          },
          {
            name: 'requestFormCCQ',
            errors: [],
          },
          {
            name: 'ownerCommit',
            errors: [],
          },
        ]);
        setSignND13Success(true);
        setSignSuccess(true);
        setOfflineCreatedList(undefined, true);
        NotificationSuccess('Ký thành công');
        clearTimeout(interval);
        return;
      }
      if (transfereeSigning) {
        form.setFields([
          {
            name: 'cardContract',
            errors: [],
          },
          {
            name: 'ownerCommit',
            errors: [],
          },
        ]);
        setTransfereeSignSuccess(true);
      }
    },
  });
};
