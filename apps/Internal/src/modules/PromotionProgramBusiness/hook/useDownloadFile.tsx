import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import urlPromotionProgramBusiness from '../services/url';
import { downloadFileFn } from '@react/utils/handleFile';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';

export const queryKeyList = 'GET_LIST_PROMOTION_PROGRAM_BUSINESS_VIEW';
interface FetcherParams {
  id: string;
}

const fetcher = async ({ id }: FetcherParams) => {
  const res = await axiosClient.get<any, Blob>(
    `${urlPromotionProgramBusiness}/export/${id}`,
    {
      responseType: 'blob',
    }
  );
  return res;
};

const useDownloadFile = () => {
  return useMutation<Blob, Error, FetcherParams>({
    mutationFn: fetcher,
    onSuccess: (res) => {
      const fileNameDownloaded = useFileNameDownloaded.getState().name;
      downloadFileFn(
        res,
        fileNameDownloaded,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    },
  });
};

export default useDownloadFile;
