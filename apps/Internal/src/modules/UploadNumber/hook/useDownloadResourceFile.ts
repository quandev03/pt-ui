import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';
interface ExportRequest {
  uri: string;
  filename?: string;
}

const openSaveDialog = (data: Blob, filename?: string) => {
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = filename ?? 'download';
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
};

export const useDownloadResourceFile = () => {
  return useMutation({
    mutationFn: async (payload: ExportRequest) => {
      return await safeApiClient.get<Blob>(
        `${prefixSaleService}/files/download?fileUrl=${payload.uri}`,
        {
          responseType: 'blob',
        }
      );
    },
    onSuccess(data, payload) {
      openSaveDialog(data, payload.filename);
    },
  });
};
