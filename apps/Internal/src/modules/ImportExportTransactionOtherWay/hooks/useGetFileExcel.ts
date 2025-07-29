import { useMutation } from '@tanstack/react-query';
import { getDownloadFile } from '../services';
import { downloadFileFn } from '@react/utils/handleFile';
import { FILE_TYPE } from '@react/constants/app';

export const useGetFileExcel = () => {
  return useMutation({
    mutationFn: getDownloadFile,
    onSuccess: (data, { filename }) =>
      downloadFileFn(data, filename ?? '', FILE_TYPE.xlsx),
  });
};
