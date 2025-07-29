import { FILE_TYPE } from '@react/constants/app';
import { prefixCatalogService } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';
const fetch = (params: { id: string; startDate: string; endDate: string }) => {
  const paramCustom = {
    startDate: params.startDate,
    endDate: params.endDate,
  };
  return axiosClient.get<any, Blob>(
    `${prefixCatalogService}/organization-debt-histories/export/${params.id}`,
    {
      params: paramCustom,
      responseType: 'blob',
    }
  );
};

export const useExport = () => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (res: Blob) => {
      const nameFile = useFileNameDownloaded.getState().name;
      downloadFileFn(res, nameFile ? nameFile : '', FILE_TYPE.xlsx);
    },
  });
};
