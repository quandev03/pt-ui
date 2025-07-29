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
  const {
    contractNo,
    customerId,
    name,
    sex,
    birthday,
    id,
    issue_date,
    issue_by,
    address,
    phone,
    serialSim,
    pkName,
    type,
    deviceToken,
    codeDecree13,
    ccdvvt,
    cusType
  } = body;
  const payload = {
    codeDecree13: codeDecree13,
    contractNo,
    customerId,
    ccdvvt,
    contractDate: dayjs().format(DateFormat.DEFAULT),
    customerName: name,
    gender: sex,
    birthDate: dayjs(birthday).format(DateFormat.DEFAULT),
    idNo: id,
    idDate: dayjs(issue_date).format(DateFormat.DEFAULT),
    idPlace: issue_by,
    address,
    type: type,
    phoneLists: [
      {
        phoneNumber: phone,
        serialSim: serialSim,
        packagePlan: pkName,
        object: cusType
      },
    ],
    deviceToken,
  };
  return axiosClient.post<FilterGenContract, Res>(
    `${prefixCustomerService}/change-information/gen-change-info-contract`,
    payload
  );
};

export const useGenContract = () => {
  const hash = window.location.hash;
  const path = hash.split('/')[1];
  const {
    formAntd: form,
    setIsDisabledContract,
    setOpenModalPdf,
    setIntervalApi,
    setSignSuccess,
    setIsDisabledCommit
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
        }/#/change-info?id=${id}&type=${res.type}`;

        form.setFieldValue('signLink', link);
        window.open(link, '_blank', 'top=200,left=500,width=600,height=600');

        const interval = setInterval(() => {
          mutateSigningChecker({ contractId: id, key: TypePDF.HD });
        }, 5000);
        setIntervalApi(interval);
      } else {
        setIsDisabledContract(false);
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
