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
    console.log('Error fetching image:', error);
    // Return null instead of throwing error to handle gracefully
    return null;
  }
};

export const useGetImage = (onSuccess?: (data: Blob) => void) => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      try {
        // Only call onSuccess if data is a valid Blob
        if (data instanceof Blob) {
          console.log('Blob received:', data);
          onSuccess?.(data);
        } else {
          console.log('No image data received or invalid response');
          // Call onSuccess with null to indicate no image
          onSuccess?.(null as any);
        }
      } catch (error) {
        console.log('Error processing image:', error);
        // Call onSuccess with null to indicate error
        onSuccess?.(null as any);
      }
    },
    onError: (error) => {
      console.log('Mutation error:', error);
      // Call onSuccess with null to indicate error
      onSuccess?.(null as any);
    },
  });
};
