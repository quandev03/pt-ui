import { prefixSaleService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';
import { IListOfServicePackageForm } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import {
  AnyElement,
  EStatus,
  MESSAGE,
  NotificationSuccess,
} from '@vissoft-react/common';

const fetch = async (data: IListOfServicePackageForm) => {
  const formData = new FormData();
  const dataForm = {
    pckName: data.pckName,
    packagePrice: Number(data.packagePrice),
    status: EStatus.ACTIVE,
    pckCode: data.pckCode,
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

export const useAdd = (onSuccess?: () => void) => {
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
  });
};
