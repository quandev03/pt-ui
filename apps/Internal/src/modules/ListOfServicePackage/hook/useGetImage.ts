import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';

const fetch = async (idPackageProfile: string) => {
  try {
    const res = await safeApiClient.post(
      `${prefixSaleService}/package-manager/download-image/${idPackageProfile}`,
      {
        responseType: 'blob',
      }
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const useGetImage = () => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      console.log('useGetImage success data:', data);
    },
  });
};
