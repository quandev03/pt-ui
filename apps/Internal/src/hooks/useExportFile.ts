import { useMutation } from '@tanstack/react-query';
import { safeApiClient } from '../services';
export interface IExportPayload {
  filename?: string;
  url: string;
  params: Record<string, string>;
}
const fetcher = async (payload: IExportPayload) => {
  const { url, params } = payload;
  const res = await safeApiClient.get<Blob>(url, {
    params,
    responseType: 'blob',
  });
  return res;
};
export const useExportFile = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess(data, variables) {
      const blobFile = new Blob([data], {
        type: data.type,
      });
      const url = window.URL.createObjectURL(blobFile);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', variables.filename ?? 'danh_sach');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
  });
};
