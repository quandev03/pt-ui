import { useMutation } from '@tanstack/react-query';
import { FILE_TYPE } from '@react/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFileFn } from '@react/utils/handleFile';
import { prefixResourceService } from '@react/url/app';

interface DownloadFileReq {
  fileType: 'FILENAME' | 'TEMPLATE' | 'RESULT';
  id?: number;
  fileName: string;
  detailId?: number;
}

export const queryKeyDownloadFile = 'query-get-download-file';

const fetcher = (params: DownloadFileReq) => {
  return axiosClient.get<DownloadFileReq, Blob>(
    `${prefixResourceService}/sim-registrations/download-file`,
    { params, responseType: 'blob' }
  );
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeyDownloadFile],
    onSuccess: (data, { fileName }) =>
      downloadFileFn(data, fileName, 'application/octet-stream'),
  });
};
