import { NotificationSuccess } from '@react/commons/index';
import { CommonError } from '@react/commons/types';
import { getDate } from '@react/utils/datetime';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import useOwnershipTransferStore from '../store';

export interface FilterConfirmOtp {
  isdn: string;
  idEkyc: string;
  id: string;
  otp: string;
  transactionId: string;
}

const fetcher = ({ files: { referenceFiles, ...fileList }, form }: any) => {
  const formData = new FormData();
  console.log('fileList :>> ', fileList);
  Object.keys(fileList).forEach((key: string) => {
    if (fileList[key]) {
      formData.append(key, fileList[key] as Blob);
    }
  });
  if (referenceFiles?.length) {
    referenceFiles.forEach((file: any) =>
      formData.append('referenceFiles', file)
    );
  }
  const data = {
    contractNo: form.contractNo,
    document: form.transfereeDocument,
    name: form.transfereeName,
    isdn: form.isdn.replace(/0(\d+)/, '$1'),
    serialSim: undefined,
    uploadDocumentDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    nationality: form.transfereeCountry,
    id: form.transfereeIdNo,
    issue_by: form.transfereePlaceOfIssue,
    issue_date: getDate(form.transfereeDateOfIssue),
    birthday: getDate(form.transfereeDateOfBirth),
    sex: form.transfereeSex,
    address: form.transfereeAddress,
    city: form.transfereeCity,
    district: form.transfereeDistrict,
    ward: form.transfereeWard,
    expiry: getDate(form.transfereeExpiry),
    providerAreaCode: form.ccdvvt,
    otpReason: form.otpReason,
    idExpireDateNote: undefined,
    passSensor: form.passSensor,
    otpStatus: form.transfereeOtp ? '1' : form.otpReason ? '0' : undefined,
    idExpiryDateNote: form.idExpiryDateNoteNew,
    customerCode: form.customerCode,
  };
  formData.append('data', JSON.stringify(data));
  return axiosClient.post<any>(
    `${prefixCustomerService}/change-information/ownership-transfer`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useOwnershipTransfer = (onSuccess: () => void, onError: (err: CommonError) => void) => {
  const { resetGroupStore, formAntd, interval } = useOwnershipTransferStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Chuyển chủ quyền thành công');
      clearTimeout(interval);
      resetGroupStore();
      formAntd.resetFields();
      window.location.reload();
      onSuccess();
    },
    onError: (err: CommonError) => {
      onError(err);
    },
  });
};
