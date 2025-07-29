import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

const getAttachmentFile = async ({
  type,
  url,
}: {
  type: string;
  url: string;
}) => {
  const res = await axiosClient.get<any, Blob>(url, { responseType: 'blob' });
  if (type === 'PDF') {
    const blob = new Blob([res], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);
  }
  return window.URL.createObjectURL(res);
};
export const useGetAttachment = () => {
  return useMutation({
    mutationFn: getAttachmentFile,
  });
};
