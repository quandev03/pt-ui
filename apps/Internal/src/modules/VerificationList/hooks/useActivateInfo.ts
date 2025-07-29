import { DateFormat } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import { useMutation } from '@tanstack/react-query';
import { UploadFile } from 'antd';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import useCensorshipStore from '../store';
import { IDType } from '../types';
import { NotificationError } from '@react/commons/Notification';
import { AnyElement, IErrorResponse } from '@react/commons/types';
import { groupBy } from 'lodash';

export interface Req {
  cardFront: UploadFile;
  cardBack: UploadFile;
  portrait: UploadFile;
}

interface Res {
  data: any;
}

export const queryKeyActivateInfo = 'query-subscription-activate-info';

const fetcher = (files: any, data: {
  isdn: string,
  serial: string
}) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      formData.append(key, files[key] as Blob);
    }
  });
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/activation-info?cardType=1`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useActivateInfo = () => {
  const { setDataActivateInfo, formAntd,setIsDisUploadImage,setListErr } = useCensorshipStore();

  return useMutation({
    mutationKey: [queryKeyActivateInfo],
    mutationFn: ({ files, data }: { files: AnyElement, data: { isdn: string, serial: string } }) => fetcher(files, data),
    onSuccess: (data: any) => {
      setDataActivateInfo(data);
      formAntd.setFieldsValue({
        ...data,
        issue_date: dayjs(data.issue_date, DateFormat.DEFAULT_V4),
        expiry: dayjs(data.expiry, DateFormat.DEFAULT_V4).isValid()
          ? dayjs(data.expiry, DateFormat.DEFAULT_V4)
          : undefined,
        birthday: dayjs(data.birthday, DateFormat.DEFAULT_V4).isValid()
          ? dayjs(data.birthday, DateFormat.DEFAULT_V4)
          : undefined,
        contractDate: dayjs().format(formatDateBe),
        isDisableCheck: false,
      });
      if (data.errors && data.errors.length > 0) { 
        const mappedErrors = data.errors.map((error: AnyElement) => ({
          ...error,
          field: error.field === 'issue_by' ? 'id' : error.field
        }));
        setListErr(mappedErrors)
      }
      
      if (formAntd.getFieldValue('document') === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể kích hoạt với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
      }
    },
    onError: (error: IErrorResponse) => {
      if (error?.code === 'CUS31999') {
        setIsDisUploadImage(true);
      }
      else {
        setIsDisUploadImage(false);
      }
    },
  });
};
