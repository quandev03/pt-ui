import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
interface ExportRequest {
  uri: string;
}
const fetcher = async ({ uri }: ExportRequest) => {
  return axiosClient.get<string, Blob>(`${prefixCustomerService}/file/${uri}`, {
    responseType: 'blob',
  });
};

export const usePreviewFile = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
