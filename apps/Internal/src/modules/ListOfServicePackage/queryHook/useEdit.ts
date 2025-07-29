import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { FieldErrorsType, IErrorResponse } from '@react/commons/types';
import { formatDateBe } from '@react/constants/moment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const editApi = ({ file, form, id }: any) => {
  const formData = new FormData();
  formData.append('images', file as Blob ?? null);
  const data = JSON.stringify({
    pckCode: form.pckCode,
    pckName: form.pckName,
    groupType: form.groupType,
    groupTypeName: form.groupTypeName,
    pckType: form.pckType,
    pckTypeName: form.pckTypeName,
    regType: form.regType,
    regTypeName: form.regTypeName,
    profileType: form.profileType,
    profileTypeName: form.profileTypeName,
    fromDate: form.fromDate
      ? dayjs(form.fromDate).format(formatDateBe)
      : undefined,
    toDate: form.toDate ? dayjs(form.toDate).format(formatDateBe) : undefined,
    apiCode: form.apiCode,
    apiPromCode: form.apiPromCode,
    smsCode: form.smsCode,
    smsPromCode: form.smsPromCode,
    activationCode: form.activationCode,
    cycleQuantity: form.cycleQuantity,
    cycleUnit: form.cycleUnit,
    displayStatus: form.displayStatus === 'true' ? true : false,
    mobileDisplayPos: form.mobileDisplayPos,
    pcDisplayPos: form.pcDisplayPos,
    status: form.status,
    description: form.description,
    topSale: form.topSale,
  });
  formData.append('data', data);
  return axiosClient.put<any, any>(
    `${prefixCatalogService}/package-profile/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};
export const useEditPackage = (form: FormInstance) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_SERVICE_PACKAGE],
      });
      NotificationSuccess('Cập nhật thành công');
      navigate(-1);
    },
    onError: (error: IErrorResponse) => {
      if (error.errors.length) {
        form.setFields(
          error.errors.map((e: FieldErrorsType) => ({
            name: e.field,
            errors: [e.detail],
          }))
        );
      } else {
        NotificationError(error.detail);
      }
    },
  });
};
