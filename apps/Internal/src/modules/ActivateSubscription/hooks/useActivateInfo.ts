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
import { IDType } from '../../VerificationList/types';

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
    `${prefixCustomerService}/ocr-active?cardType=1`,
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
  const location = useLocation();

  return useMutation({
    mutationKey: [queryKeyActivateInfo],
    mutationFn: ({ files, data }: { files: any, data: { isdn: string, serial: string } }) => fetcher(files, data),
    onSuccess: (data: any) => {
      if (
        ((location.pathname !== pathRoutes.activationRequestListCreate &&
          !includes(
            listRoleByRouter,
            ActionsTypeEnum.ACTIVATE_SUBSCRIBER_MASH
          )) ||
          (location.pathname === pathRoutes.activationRequestListCreate &&
            !includes(
              listRoleByRouter,
              ActionsTypeEnum.CREATE_MASH_REQUEST
            ))) &&
        data?.total_sim >= 3
      ) {
        setActiveSubmitMore3(false);
        NotificationError(
          location.pathname === pathRoutes.activationRequestListCreate
            ? 'User không có quyền tạo yêu cầu kích hoạt lớn hơn 3 thuê bao trên 1 GTTT'
            : 'User không có quyền kích hoạt lớn hơn 3 thuê bao'
        );
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
        expiry: data.expiry
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
