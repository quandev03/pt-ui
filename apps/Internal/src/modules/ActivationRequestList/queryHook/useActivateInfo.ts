import { useMutation } from '@tanstack/react-query';
import { UploadFile } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import { useActiveSubscriptStore } from '../store';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { FormInstance } from 'antd/lib';
import { groupBy } from 'lodash';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { AnyElement } from '@react/commons/types';

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
      console.log(files[key]);
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

export const useActivateInfo = (form: FormInstance) => {
  const {
    setDataActivateInfo,
    setDataActivationRequest,
    formAntd,
    setIsChangeValue,
    resetDataActivateInfo,
    resetDataActivationRequest,
    setIsSignAgainFlag,
    setIsChangeName,
  } = useActiveSubscriptStore();

  return useMutation({
    mutationKey: [queryKeyActivateInfo],
    mutationFn: ({ files, data }: { files: AnyElement, data: { isdn: string, serial: string } }) => fetcher(files, data),
    onSuccess: (data: any) => {
      setDataActivateInfo(data);
      setDataActivationRequest(data);
      setIsChangeValue(true);
      // setIsSignAgainFlag(true);
      setIsChangeName(true);
      formAntd?.setFieldsValue({
        ...data,
        issue_date: dayjs(data.issue_date, DateFormat.DEFAULT_V4),
        expiry: data.expiry ? dayjs(data.expiry, DateFormat.DEFAULT_V4) : null,
        birthday: dayjs(data.birthday, DateFormat.DEFAULT_V4),
      });
      if (data?.errors?.length > 0) {
        const newObj = groupBy(data?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        form.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
      if (data?.c06_errors) {
        NotificationError(data?.c06_errors);
      }
      if (data?.c06SuccessMessage) {
        NotificationSuccess(data?.c06SuccessMessage);
      }
    },
    onError: (data: any) => {
      resetDataActivateInfo();
      resetDataActivationRequest();
      form.setFieldsValue({
        cardContract: undefined,
        document: '1',
        name: '',
        id: '',
        issue_by: '',
        issue_date: '',
        birthday: '',
        sex: null,
        address: '',
        city: null,
        district: null,
        ward: null,
        expiry: '',
        idExpiryDateNote: '',
        idExpireDate: '',
      });
    },
  });
};
