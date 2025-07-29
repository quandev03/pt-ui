import { useMutation } from '@tanstack/react-query';
import { UploadFile } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import dayjs from 'dayjs';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import includes from 'lodash/includes';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { groupBy } from 'lodash';
import { useLocation } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGenSecretKey } from './useGenSecretKey';
import { useCheckCustomer } from './useCheckCustomer';
import { useGenCustomerCode } from './useGenCustomerCode';

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

export const useActivateInfo = () => {
  const {
    setDataActivateInfo,
    formAntd,
    setActiveSubmitMore3,
    setDisableButtonCheck,
    setSuccessCheckCondition,
  } = useActiveSubscriptStore();
  const { mutate: mutateGenSecretKey } = useGenSecretKey();
  const { mutate: checkOldCustomer } = useCheckCustomer();
  return useMutation({
    mutationKey: [queryKeyActivateInfo],
    mutationFn: ({ files, data }: { files: any, data: { isdn: string } }) => fetcher(files, data),
    onSuccess: (data: any, variables) => {
      setDataActivateInfo(data);
      checkOldCustomer({
        isdn: variables.data.isdn,
        id: data.id,
      });
      setActiveSubmitMore3(true);  
      mutateGenSecretKey({ idKyc: data.id_ekyc });
      formAntd.setFieldsValue({
        ...data,
        sex: data.sex !== '' ? data.sex : undefined,
        city: data.city !== '' ? data.city : undefined,
        district: data.district !== '' ? data.district : undefined,
        ward: data.ward !== '' ? data.ward : undefined,
        issue_date: dayjs(data.issue_date, DateFormat.DEFAULT_V4),
        expiry:
          data.expiry !== ''
            ? dayjs(data.expiry, DateFormat.DEFAULT_V4)
            : undefined,
        birthday: dayjs(data.birthday, DateFormat.DEFAULT_V4),
      });

      if (data?.errors?.length > 0) {
        const newObj = groupBy(data?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        formAntd.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
      if (data?.c06_errors) {
        NotificationError(data?.c06_errors);
      }
      if (data?.errors?.length === 0 && !data?.c06_errors) {
        setSuccessCheckCondition(true);
        setDisableButtonCheck(true);
      }
      if (data?.c06SuccessMessage) {
        NotificationSuccess(data?.c06SuccessMessage);
      }
    },
  });
};
