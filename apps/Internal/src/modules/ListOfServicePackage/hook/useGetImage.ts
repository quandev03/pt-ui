import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants';
import {
  safeRequestWithResponse,
  axiosClient,
} from 'apps/Internal/src/services';

const fetch = async (idPackageProfile: string) => {
  try {
    const res = await safeRequestWithResponse<Blob>(
      axiosClient.post<Blob>(
        `${prefixSaleService}/package-manager/download-image/${idPackageProfile}`,
        {},
        {
          responseType: 'blob',
        }
      )
    );
    return res.data;
  } catch (error) {
    console.log(error, 'error');
    throw error;
  }
};

export const useGetImage = (onSuccess?: (data: Blob) => void) => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      try {
        // Ensure data is a Blob before calling onSuccess
        if (data instanceof Blob) {
          console.log('Blob received:', data);
          onSuccess?.(data);
        } else {
          console.error('Response is not a Blob:', data);
        }
      } catch (error) {
        console.log(error, 'error');
      }
    },
  });
};
