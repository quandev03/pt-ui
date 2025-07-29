import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { urlPostCheckList } from '../services/url';
import { downloadFile } from '@react/utils/handleFile';

const fetcher = async (filter: any) => {
  const customParams = {
    ...filter,
    typeDate: 1,
    pageSize: 1000,
    page: 0
  };
  const res = await axiosClient.get<any, Blob>(
    `${urlPostCheckList}/export-audit-sub-document`,
    { params: customParams }
  );
  return res || [];
};
export const useExport = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res: Blob) => {
      downloadFile(res, 'danh_sach_hau_kiem');
    },
  });
};
