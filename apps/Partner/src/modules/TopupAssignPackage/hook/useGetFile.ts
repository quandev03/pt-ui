import { FILE_TYPE } from '@react/constants/app';
import { prefixSaleService } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
interface ExportRequest {
  uri: string;
}

const fetcher = () => {
  return axiosClient.get<ExportRequest, Blob>(
    `${prefixSaleService}/topup-package-transction/get-sample-file`,
    {
      responseType: 'blob',
    }
  );
};
export const useGetFile = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res: Blob) => {
      downloadFileFn(res, 'Danh-sach-nap-tien-mau.xlsx', FILE_TYPE.xlsx);
    },
  });
};
