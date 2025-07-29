import { CommonError, FieldErrorsType } from '@react/commons/types';
import { formatDate } from '@react/constants/moment';
import { useMutation } from '@tanstack/react-query';
import {
  baseSignUrl,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import useCensorshipStore from '../store';
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
export enum SignEnum { //1 là Online, 2 là offline
  ONLINE = '1',
  OFFLINE = '2',
}

interface Res {
  contractId: string;
  type: number; //1 là biểu mẫu, 2 là hợp đồng
  contractTimeStamp: string;
}
export const queryKeyGenContract = 'query-gen-contract-update-subdoc';

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
    type,
    deviceToken,
    serialSim,
    ccdvvt,
    nationality,
    packagePlan,
    createdContractDate,
  } = body;
  const payload = {
    contractNo,
    customerId,
    ccdvvt,
    contractDate: createdContractDate,
    customerName: name,
    gender: sex,
    birthDate: dayjs(birthday).format(formatDate),
    idNo: id,
    idDate: dayjs(issue_date).format(formatDate),
    idPlace: issue_by,
    address,
    type: type,
    phoneNumber: phone,
    phoneLists: [
      {
        phoneNumber: phone,
        serialSim: serialSim,
        packagePlan: packagePlan,
      },
    ],
    deviceToken,
    nationality,
  };
  return axiosClient.post<FilterGenContract, Res>(
    `${prefixCustomerService}/gen-tmp-contract`,
    payload
  );
};

export const useGenContract = () => {
  const {
    formAntd: form,
    setIsDisabledContract,
    setOpenModalPdf,
    setIntervalApi,
    setIsSignSuccess,
    setIsOffSign,
    isSignSuccess,
  } = useCensorshipStore();
  const { mutate: mutateSigningChecker } = useContractSigningChecker();
  return useMutation({
    mutationKey: [queryKeyGenContract],
    mutationFn: fetcher,
    onSuccess: (res, variables) => {
      const id = res?.contractId;
      const timeStampContract = res?.contractTimeStamp;
      form.setFieldsValue({
        contractId: id,
      });
      if (variables.type === 'PNG') {
        const link = `${
          baseSignUrl || window.location.origin
        }/#/censorship?id=${id}&type=${
          res.type
        }&timeStampContract=${timeStampContract}`;
        form.setFieldValue('signLink', link);
        window.open(link, '_blank', 'top=200,left=500,width=600,height=600');
        form.setFieldValue('contractId', id);
        const interval = setInterval(() => {
          mutateSigningChecker({
            contractId: id,
            key: TypePDF.HD,
            timeStampContract,
          });
        }, 5000);
        if (isSignSuccess) {
          clearInterval(interval);
        } else {
          setIntervalApi(interval);
        }
      } else {
        setIsDisabledContract(false);
        setOpenModalPdf(true);
        setIsSignSuccess(true);
        setIsOffSign(true);
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
