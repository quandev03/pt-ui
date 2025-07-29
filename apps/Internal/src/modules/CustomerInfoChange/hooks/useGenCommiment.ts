import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import useActiveSubscriptStore from '../store';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import {
  baseSignUrl,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';
import {
  TypePDF,
  useContractSigningChecker,
} from './useContractSigningChecker';

export interface FilterGenContract {
  isdn: string;
  idEkyc: string;
  id: string;
  otp: string;
  transactionId: string;
}

interface Res {
  contractId: string;
  type: number; //1 là biểu mẫu, 2 là hợp đồng
}
export const queryKeyGenContract = 'query-gen-contract';

const fetcher = (body: any) => {
  return axiosClient.get<any, Res>(
    `${prefixCustomerService}/change-information/get-ownership-commitment-final/${body.contractNo}`,
    // {
    //   params: {
    //     contractNo: body.contractNo,
    //   },
    // }
  );
};

export const useGenCommitment = () => {
  const hash = window.location.hash;
  const path = hash.split('/')[1];
  const {
    formAntd: form,
    setIsDisabledCommit,
    setOpenModalPdf,
    setIntervalApi,
    setSignSuccess,
  } = useActiveSubscriptStore();
  const { mutate: mutateSigningChecker } = useContractSigningChecker();
  return useMutation({
    mutationKey: [queryKeyGenContract],
    mutationFn: fetcher,
    onSuccess: (res, variables) => {
      const id = res?.contractId;
      form.setFieldsValue({
        contractId: res?.contractId,
        fileND13: '',
        decree13: '',
        cardContract: '',
      });
      setSignSuccess(false);
      if (variables.type === 'PNG') {
        const link = `${
          baseSignUrl || window.location.origin
        }/#/?id=${id}&type=${res.type}`;
        const preLink = `${
          baseSignUrl || window.location.origin
        }/#/pre-contract?id=${id}&type=${res.type}`;
        if (path !== 'activation-request-list') {
          form.setFieldValue('signLink', link);
          window.open(link, '_blank', 'top=200,left=500,width=600,height=600');
        } else {
          form.setFieldValue('signLink', preLink);
          window.open(
            preLink,
            '_blank',
            'top=200,left=500,width=600,height=600'
          );
        }
        // form.setFieldValue('signLink', link);
        // window.open(link, '_blank', 'top=200,left=500,width=600,height=600');
        const interval = setInterval(() => {
          mutateSigningChecker({ contractId: id, key: TypePDF.HD });
        }, 5000);
        setIntervalApi(interval);
      } else {
        setIsDisabledCommit(false);
        setOpenModalPdf(true);
      }
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field,
            errors: [item.detail],
          }))
        );
      }
    },
  });
};
