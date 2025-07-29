import { prefixCustomerService } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFileFn } from '@react/utils/handleFile';
import { IErrorResponse } from '@react/commons/types';
import { NotificationError } from '@react/commons/Notification';

export interface ExportRequest {
  uri: string;
  filename?: string;
  params?: any;
}

const fetcher = async (url: string) => {
  return await axiosClient.get<ExportRequest, Blob>(
    `${prefixCustomerService}/file/customer-management/template/${url}`,
    {
      responseType: 'blob',
    }
  );
};

export const useGetFileTemplate = (isContract: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_FILE_SIM_TEMPLATE],
      });
      if(isContract) {
        downloadFileFn(
            data,
            'file_hop_dong_bien_ban_mau',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          );
      } else {
        downloadFileFn(
            data,
            'file_kich_hoat_thue_bao_M2M_mau',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
      }
    },
    onError: (err: IErrorResponse) => {
      if (err?.detail) {
        NotificationError(err?.detail);
      }
    },
  });
};
