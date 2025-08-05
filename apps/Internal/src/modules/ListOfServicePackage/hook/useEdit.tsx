import { prefixSaleService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';
import { IListOfServicePackageForm } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { AnyElement } from '@vissoft-react/common';

const fetch = async (data: IListOfServicePackageForm & { id: string }) => {
  const formData = new FormData();
  const dataForm = {
    packageName: data.packageName,
    packagePrice: data.packagePrice,
    status: data.status,
    packageCode: data.packageCode,
  };
  formData.append('image', data.image as File);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.LIST_OF_SERVICE_PACKAGE],
      });
      onSuccess?.();
    },
  });
};
