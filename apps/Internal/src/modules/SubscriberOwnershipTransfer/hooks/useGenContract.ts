import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import useOwnershipTransferStore from '../store';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import {
  baseSignUrl,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';
import { SignEnum } from './useGenContractNo';
import { useContractSigningChecker } from './useContractSigningChecker';

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

const fetcher = ({ activeType, ...body }: any) => {
  const {
    contractNo,
    transfereeName,
    transfereeSex,
    transfereeDateOfBirth,
    id,
    transfereeDateOfIssue,
    isdn,
    transferorDateOfBirth,
    transferorDateOfIssue,
    pkName,
    ccdvvt,
    selectedRowKeys,
    deviceToken,
    transferorSex,
    ccdvvtOwnershipTransfer,
  } = body;
  const payload = {
    ...body,
    originPhoneNumber: isdn,
    transfereeEmail: undefined,
    transferorEmail: undefined,
    ownershipTransferTime: dayjs(transfereeDateOfBirth).format(
      DateFormat.DEFAULT
    ),
    transferorPhoneNumber: undefined,
    contractNo,
    ccdvvt,
    contractDate: dayjs().format(DateFormat.DEFAULT),
    customerName: transfereeName,
    isMale: transferorSex === '1',
    isFeMale: transferorSex === '0',
    isMaleTransferee: transfereeSex === '1',
    isFeMaleTransferee: transfereeSex === '0',
    transfereeDateOfBirth: dayjs(transfereeDateOfBirth).format(
      DateFormat.DEFAULT
    ),
    transferorDateOfBirth: dayjs(transferorDateOfBirth).format(
      DateFormat.DEFAULT
    ),
    idNo: id,
    transfereeDateOfIssue: dayjs(transfereeDateOfIssue).format(
      DateFormat.DEFAULT
    ),
    transferorDateOfIssue: dayjs(transferorDateOfIssue).format(
      DateFormat.DEFAULT
    ),
    phoneLists: [
      {
        phoneNumber: isdn,
        packagePlan: undefined,
      },
    ],
    type: activeType === SignEnum.ONLINE ? 'PNG' : 'PDF', //1 là Online, 2 là offline
    deviceToken: activeType === SignEnum.ONLINE ? deviceToken : undefined,
    codeDecree13: selectedRowKeys,
    ccdvvtOwnershipTransfer: ccdvvtOwnershipTransfer,
  };
  return axiosClient.post<FilterGenContract, Res>(
    `${prefixCustomerService}/change-information/gen-ownership-transfer-contract`,
    payload
  );
};

export const useGenContract = () => {
  const {
    formAntd: form,
    setOfflineCreatedList,
    setOpenModalPdf,
    setIntervalApi,
    setSignSuccess,
    selectedRowKeys,
    deviceToken,
    setContractType,
    interval: originInterval,
  } = useOwnershipTransferStore();
  const { mutate: mutateSigningChecker } = useContractSigningChecker();
  return useMutation({
    mutationKey: [queryKeyGenContract],
    mutationFn: (body: any) =>
      fetcher({ selectedRowKeys, deviceToken, ...body }),
    onSuccess: (res, { contractType, activeType }) => {
      const id = res?.contractId;
      form.setFieldsValue({
        contractId: res?.contractId,
        fileND13: '',
        decree13: '',
        // cardContract: '',
        // requestFormCCQ: '',
        ownerCommit: '',
      });
      setSignSuccess(false);
      contractType && setContractType(contractType);
      if (activeType === SignEnum.ONLINE) {
        const preLink = (customerType: 'old' | 'new') =>
          `${
            baseSignUrl || window.location.origin
          }/#/ownership-transfer?id=${id}&type=${
            res.type
          }&customerType=${customerType}`;
        form.setFieldValue('oldLink', preLink('old'));
        form.setFieldValue('newLink', preLink('new'));
        // window.open(
        //   preLink('new'),
        //   '_blank',
        //   'top=200,left=500,width=600,height=600'
        // );
        clearTimeout(originInterval);
        const interval = setInterval(() => {
          mutateSigningChecker({ contractId: id });
        }, 5000);
        setIntervalApi(interval);
      } else {
        setOfflineCreatedList(contractType);
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
