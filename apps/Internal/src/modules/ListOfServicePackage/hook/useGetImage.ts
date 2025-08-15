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
    return null;
  }
};

export const useGetImage = (onSuccess?: (data: Blob) => void) => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      try {
        if (data instanceof Blob) {
          onSuccess?.(data);
        } else {
          onSuccess?.(null as any);
        }
      } catch (error) {
        onSuccess?.(null as any);
      }
    },
    onError: (error) => {
      onSuccess?.(null as any);
    },
  });
};
