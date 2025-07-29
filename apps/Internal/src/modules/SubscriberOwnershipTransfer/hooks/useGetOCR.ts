import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useOwnershipTransferStore from '../store';

export interface ICCCDInfo {
  documentType: string;
  name: string;
  id: string;
  issueBy: string;
  issueDate: string;
  birthday: string;
  sex: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  expiry: string;
  idEkyc: string;
  checkSendOTP: boolean;
  listPhoneNumber: string[];
  c06_required: boolean;
  totalSim: number;
  nationality: string;
}

export const queryKeyOldOcr = 'query-key-old-ocr';

const fetcher = (payload: any) => {
  const formData = new FormData();
  formData.append('front', payload.cardFront as Blob);
  formData.append('back', payload.cardBack as Blob);
  formData.append('portrait', payload.portrait as Blob);

  return axiosClient.post<string, ICCCDInfo>(
    `${prefixCustomerService}/call-ocr-and-face-check?cardType=1`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useGetOCR = (onSuccess: (data: ICCCDInfo) => void) => {
  const { setDataTransferorInfo } = useOwnershipTransferStore();
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeyOldOcr],
    onSuccess(data) {
      onSuccess(data);
      setDataTransferorInfo(data);
    },
  });
};
