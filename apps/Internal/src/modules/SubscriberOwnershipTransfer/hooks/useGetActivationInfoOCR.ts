import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useOwnershipTransferStore from '../store';
import { MESSAGE } from '@react/utils/message';
import { DocumentTypeEnum } from '../types';

export interface ICCCDInfoNewCustomer {
  c06SuccessMessage: string;
  nationality: string;
  document: string;
  name: string;
  id: string;
  issue_by: string;
  issue_date: string;
  birthday: string;
  sex: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  expiry: string;
  id_ekyc: string;
  check_sendOTP: boolean;
  list_phoneNumber: string[];
  total_sim: number;
  errors: IErrorField[];
  c06_errors: string;
}

interface IErrorField {
  detail: string;
  field: string;
}

const fetcher = (payload: any, data: {
  isdn: string,
}) => {
  const formData = new FormData();
  formData.append('cardFront', payload.cardFront as Blob);
  formData.append('cardBack', payload.cardBack as Blob);
  formData.append('portrait', payload.portrait as Blob);
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  return axiosClient.post<string, ICCCDInfoNewCustomer>(
    `${prefixCustomerService}/activation-info?cardType=1`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useGetActivationInfoOCR = (
  onSuccess: (data: ICCCDInfoNewCustomer) => void
) => {
  const {
    setSuccessCheckCondition,
    setDisableNewButtonCheck,
    setDataTransfereeInfo,
    formAntd: form,
  } = useOwnershipTransferStore();
  return useMutation({
    mutationFn: ({ payload, data }: { payload: any, data: { isdn: string } }) => fetcher(payload, data),
    onSuccess(data) {
      const transferorIdNo = form.getFieldValue('transferorIdNo');
      if (data.id === transferorIdNo) {
        NotificationError(MESSAGE.G41);
        return;
      }
      onSuccess(data);
      setDataTransfereeInfo(data);
      if (data.document === DocumentTypeEnum.CMND) {
        NotificationError(MESSAGE.G39);
      }
      if (data?.c06_errors) {
        NotificationError(data?.c06_errors);
      }
      if (data?.errors?.length === 0 && !data?.c06_errors) {
        setSuccessCheckCondition(true);
        setDisableNewButtonCheck(true);
      }
      if (!data.expiry) {
        setDisableNewButtonCheck(false);
      }
      if (data?.c06SuccessMessage) {
        NotificationSuccess(data?.c06SuccessMessage);
      }
    },
  });
};
