import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';
import { formatDateV2 } from '@react/constants/moment';
import { useMutation } from '@tanstack/react-query';
import { FormInstance, UploadFile } from 'antd';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import useRepresentativeStore from '../store';
import { IOcrResponse } from '../type';

export interface Req {
  front: UploadFile;
  back: UploadFile;
  portrait: UploadFile;
}

const fetcher = (files: any) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      formData.append(key, files[key] as Blob);
    }
  });
  return axiosClient.post<Req, IOcrResponse>(
    `${prefixCustomerService}/enterprise/ocr?cardType=1`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
export const useGetInfoOcr = (form: FormInstance) => {
  const { setIsAllowSave, setIsDisableCheckInfo } = useRepresentativeStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: IOcrResponse) => {
      form.setFieldsValue({
        idType: data.documentType,
        name: data.name,
        idNo: data.id,
        idIssuePlace: data.issueBy,
        idIssueDate: data.issueDate
          ? dayjs(data.issueDate, formatDateV2)
          : undefined,
        birthday: data.birthday
          ? dayjs(data.birthday, formatDateV2)
          : undefined,
        sex: data.sex,
        address: data.address,
        province: data.city,
        district: data.district,
        precinct: data.ward,
        nationality: data.nationality,
        idExpiry: data.expiry ? dayjs(data.expiry, formatDateV2) : undefined,
        idEkyc: data.idEkyc,
      });
      if (data?.c06_errors) {
        NotificationError(data?.c06_errors);
        setIsAllowSave(false);
        setIsDisableCheckInfo(true);
      } else {
        setIsAllowSave(true);
        setIsDisableCheckInfo(true);
      }
      if (data?.c06SuccessMessage) {
        NotificationSuccess(data?.c06SuccessMessage);
        setIsAllowSave(true);
        setIsDisableCheckInfo(true);
      }
    },
    onError: (err: IErrorResponse) => {
      if (err.code === 'error_c06') {
        setIsAllowSave(false);
        setIsDisableCheckInfo(true);
      }
      NotificationError(err.detail);
    },
  });
};
