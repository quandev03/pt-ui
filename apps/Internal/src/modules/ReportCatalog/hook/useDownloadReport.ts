import { downloadFile } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';

export const useGetCurrentOrganizationKey = 'useGetCurrentOrganizationKey';

const fetcher = async ({
  payload,
  url,
}: {
  payload: Record<string, string>;
  url: string;
}) => {
  const res = await axiosClient.get<string, AxiosResponse<Blob>>(url, {
    params: { ...payload },
    responseType: 'blob',
  });
  const name = useFileNameDownloaded.getState().name;
  downloadFile(res.data, name);
  return res;
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
