import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, DateFormat, IDType } from '@react/constants/app';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { UploadFile } from 'antd';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import { axiosClient } from 'apps/Partner/src/service';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import includes from 'lodash/includes';
import useActiveSubscriptStore from '../store';
import { useGenSecretKey } from './useGenSecretKey';

export interface Req {
  cardFront: UploadFile;
  cardBack: UploadFile;
  portrait: UploadFile;
}

interface Res {
  data: AnyElement;
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
    `${prefixCustomerServicePublic}/ocr-active?cardType=1`,
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
  const listRoleByRouter = useRolesByRouter();
  const { mutate: mutateGenSecretKey } = useGenSecretKey();

  return useMutation({
    mutationKey: [queryKeyActivateInfo],
    mutationFn: ({ files, data }: { files: any, data: { isdn: string, serial: string } }) => fetcher(files, data),

    onSuccess: (data: AnyElement) => {
      if (
        !includes(listRoleByRouter, ActionsTypeEnum.ACTIVATE_SUBSCRIBER_MASH) &&
        data?.total_sim >= 3
      ) {
        setActiveSubmitMore3(false);
        NotificationError('User không có quyền kích hoạt lớn hơn 3 thuê bao');
      } else {
        setActiveSubmitMore3(true);
      }

      mutateGenSecretKey({ idKyc: data.id_ekyc });
      setDataActivateInfo(data);
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
      if (data.document === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể kích hoạt với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
      }
      if (data?.errors?.length > 0) {
        const newObj = groupBy(data?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        formAntd.setFields(
          res?.map((item: AnyElement) => ({
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
