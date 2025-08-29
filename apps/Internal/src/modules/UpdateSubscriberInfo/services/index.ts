import { AnyElement } from '@vissoft-react/common';
import { prefixSaleService } from '../../../../src/constants';
import { axiosClient, safeApiClient } from '../../../../src/services';
import {
  IGenContractPayload,
  IPayloadVerifyFaceCheck,
  IPayloadVerifyOCR,
} from '../type';

export const UpdateSubscriberInfo = {
  checkIsdn: (isdn: string) => {
    return safeApiClient.get<AnyElement>(
      `${prefixSaleService}/update-subscriber-information/check-isdn/${isdn}`
    );
  },
  ocr: async (data: IPayloadVerifyOCR) => {
    const formData = new FormData();
    formData.append('passportFile', data.passport as File);
    formData.append('serial', data.serial as string);
    const res = await axiosClient.post<AnyElement>(
      `${prefixSaleService}/update-subscriber-information/ocr-passport`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
        timeout: 60000,
      }
    );
    return res.data;
  },
  faceCheck: async (data: IPayloadVerifyFaceCheck) => {
    const formData = new FormData();
    formData.append('portrait', data.portrait as File);
    formData.append('transactionId', data.transactionId as string);
    const res = await axiosClient.post(
      `${prefixSaleService}/update-subscriber-information/face-check`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
        timeout: 60000,
      }
    );
    return res.data;
  },
  previewConfirmContract: async (transactionId: string) => {
    const res = await safeApiClient.get<Blob>(
      `${prefixSaleService}/update-subscriber-information/preview-confirm-contract/${transactionId}`,
      { responseType: 'blob' }
    );
    const blob = new Blob([res], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);
  },
  previewND13: async (transactionId: string) => {
    const res = await safeApiClient.get<Blob>(
      `${prefixSaleService}/update-subscriber-information/preview-decre13/${transactionId}`,
      { responseType: 'blob' }
    );
    const blob = new Blob([res], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);
  },
  gencontract: async (data: IGenContractPayload) => {
    const res = await safeApiClient.post<AnyElement>(
      `${prefixSaleService}/update-subscriber-information/gen-contract`,
      data
    );
    return res;
  },
  checkSignedContract: async (transactionId: string) => {
    return safeApiClient.get<AnyElement>(
      `${prefixSaleService}/update-subscriber-information/check-signed-contract/${transactionId}`
    );
  },
  submit: async (transactionId: string) => {
    const res = await safeApiClient.post<AnyElement>(
      `${prefixSaleService}/update-subscriber-information/submit/${transactionId}`
    );
    return res;
  },
  blobToFile: (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, { type: blob.type });
  },
};
