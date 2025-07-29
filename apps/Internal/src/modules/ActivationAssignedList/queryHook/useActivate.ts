import { NotificationError } from '@react/commons/index';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MESSAGE } from '@react/utils/message';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface FilterConfirmOtp {
  isdn: string;
  idEkyc: string;
  id: string;
  otp: string;
  transactionId: string;
}

const fetcher = (files: any) => {
  let formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      console.log(files[key]);
      formData.append(key, files[key] as Blob);
    }
  });
  const details = JSON.stringify(
    {
      request: {
        strSex: '1',
        strNationality: 'VNM',
        strSubName: 'Lê Lưu Hoàng',
        strIdNo: '001201031601',
        strIdIssueDate: '24/05/2021',
        strIdIssuePlace: '0',
        strBirthDay: '06/06/2001',
        strProvince: '01',
        strDistrict: '279',
        strPrecinct: '10258',
        strHome: 'Tô Hiệu',
        strAddress: 'Tử Dương',
        arrRegProm: [['007', '01']],
        strRegType: '1',
        strSubType: '0',
        strKitType: '0',
        strCustType: '0',
        strReasonCode: '0',
        strContractNo: '0',
        arrRegService: ['00', '01'],
        strAppObject: '0',
        strIsdn: '01111',
        strImsi: '0',
        strSerial: '0',
        arrImages: [[]],
      },
      activeDate: '2020-01-01',
      idExpiryDate: '2025-01-01',
      userName: 'a',
      idType: '0',
      busPermitNo: '0',
      taxCode: '0',
      authName: '0',
      authNationality: '0',
      authBirthDay: '2001-01-01',
      authAddress: 'a',
      authProvince: 'a',
      authDistrict: 'a',
      authPrecinct: 'a',
      authIssuePlace: 'a',
      authIdNo: 'authIdNo',
      authIdIssueDate: '2001-01-01',
      authIdExpireDate: '2025-01-01',
      verified: 1,
      activeStatus: '0',
      status: '0',
      idFrontImage: {
        imageType: '',
        imageCode: '',
        imagePath: '',
      },
      idBackImage: {
        imageType: '',
        imageCode: '',
        imagePath: '',
      },
      portraitImage: {
        imageType: '',
        imageCode: '',
        imagePath: '',
      },
      contractImage: {
        imageType: '',
        imageCode: '',
        imagePath: '',
      },
    },
    null,
    2
  );

  formData.append('data', details);

  return axiosClient.post<any>(`${prefixCustomerService}/activate`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data ',
    },
  });
};

export const useActivate = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      // NotificationSuccess(MESSAGE.G17);
    },
    onError: (error: any) => {
      NotificationError(error?.message ?? MESSAGE.G11);
    },
  });
};
