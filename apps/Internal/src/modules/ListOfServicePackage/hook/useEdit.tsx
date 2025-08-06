import { useMutation } from '@tanstack/react-query';
import { AnyElement, NotificationSuccess } from '@vissoft-react/common';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';
import { IListOfServicePackageForm } from '../types';

const fetch = async (data: IListOfServicePackageForm & { id: string }) => {
  const formData = new FormData();
  const dataForm = {
    pckName: data.pckName,
    packagePrice: data.packagePrice,
    status: data.status,
    pckCode: data.pckCode,
  };
  formData.append('image', data.images as File);
  formData.append(
    'data',
    new Blob([JSON.stringify(dataForm)], { type: 'application/json' })
  );
  try {
    const res = await safeApiClient.put(
      `${prefixSaleService}/package-manager/${data.id}`,
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

export const useEdit = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      onSuccess?.();
    },
  });
};
