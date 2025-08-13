import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnyElement,
  EStatus,
  IErrorResponse,
  MESSAGE,
  NotificationSuccess,
} from '@vissoft-react/common';
import { FormInstance } from 'antd';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services';
import { IListOfServicePackageForm } from '../types';

const fetch = async (data: IListOfServicePackageForm) => {
  const formData = new FormData();
  const dataForm = {
    pckName: data.pckName,
    packagePrice: Number(data.packagePrice),
    status: EStatus.ACTIVE,
    pckCode: data.pckCode,
    description: data.description,
  };
  formData.append('images', data.images as File);
  formData.append(
    'data',
    new Blob([JSON.stringify(dataForm)], { type: 'application/json' })
  );
  try {
    const res = await safeApiClient.post(
      `${prefixSaleService}/package-manager`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' } as AnyElement,
      }
    );
    return res;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const useAdd = (form: FormInstance, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetch,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.LIST_OF_SERVICE_PACKAGE],
      });
      onSuccess?.();
    },
    onError: (error: IErrorResponse) => {
      if (error.errors && error.errors.length > 0) {
        form.setFields(
          error.errors.map((item) => ({
            name: item.field,
            errors: [item.detail],
          }))
        );
      }
    },
  });
};
