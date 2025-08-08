import { AnyElement } from '@vissoft-react/common';
import { prefixSaleService } from '../../../../src/constants';
import { axiosClient, safeApiClient } from '../../../../src/services';
import { IPayloadVerifyFaceCheck, IPayloadVerifyOCR } from '../type';

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
};
