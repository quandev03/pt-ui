import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { ActionType, DateFormat } from '@react/constants/app';
import { useActiveSubscriptStore } from '../store';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import {
  baseSignUrl,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';
import {
  TypePDF,
  useContractSigningChecker,
} from './useContractSigningChecker';
import { FormInstance } from 'antd';

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
    customerCode,
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
  } = body;
  const payload = {
    codeDecree13: codeDecree13,
    contractNo,
    customerId: customerCode,
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
    phoneNumber: phone,
    phoneLists: [
      {
        phoneNumber: phone,
        serialSim: serialSim,
        packagePlan: pkName,
      },
    ],
    deviceToken,
  };

  return axiosClient.post<FilterGenContract, Res>(
    `${prefixCustomerService}/gen-contract-pre-check`,
    payload
  );
};

export const useGenContract = (form: FormInstance, typeModal?: ActionType) => {
  const {
    setIsDisabledContract,
    setOpenModalPdf,
    setIntervalApi,
    setSignSuccess,
  } = useActiveSubscriptStore();
  const { mutate: mutateSigningChecker } = useContractSigningChecker(
    form,
    typeModal
  );
  return useMutation({
    mutationKey: [queryKeyGenContract],
    mutationFn: fetcher,
    onSuccess: (res, variables) => {
      const id = res?.contractId;
      form.setFieldsValue({
        contractNo: res?.contractId,
        cardContract: '',
        fileND13: '',
      });
      setSignSuccess(false);
      if (variables.type === 'PNG') {
        const preLink = `${
          baseSignUrl || window.location.origin
        }/#/pre-contract?id=${id}&type=${res.type}`;
        form.setFieldValue('signLink', preLink);
        window.open(preLink, '_blank', 'top=200,left=500,width=600,height=600');
        const interval = setInterval(() => {
          mutateSigningChecker({ contractNo: id, key: TypePDF.HD });
        }, 5000);
        setIntervalApi(interval);
      } else {
        setIsDisabledContract(false);
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
