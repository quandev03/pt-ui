import { useMutation } from '@tanstack/react-query';
import { downloadFileFn, FILE_TYPE } from '@vissoft-react/common';
import { safeApiClient } from '../../../services/axios';
import { prefixSaleService } from '../../../../src/constants';
import useFileNameDownloaded from '../../../../src/hooks/useFileNameDownloaded';

const fetcher = () => {
  return safeApiClient.get<Blob>(
    `${prefixSaleService}/sale-package/action/get-excel`,
    {
      responseType: 'blob',
    }
  );
};

export const useGetFile = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res: Blob) => {
      const name = useFileNameDownloaded.getState().name;
      downloadFileFn(
        res,
        name ? name : 'danh-sach-thue-bao-nap-goi-mau',
        FILE_TYPE.xlsx
      );
    },
  });
};
