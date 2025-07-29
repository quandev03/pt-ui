import { prefixResourceService } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ExportRequest} from '../types';
import { downloadFileFn } from '@react/utils/handleFile';
import { IErrorResponse } from '@react/commons/types';
import { NotificationError } from '@react/commons/Notification';


const fetcher = async (isEsim: boolean) => {
    if(isEsim) {
        return await axiosClient.get<ExportRequest, Blob>(
            `${prefixResourceService}/stock-product-serial-upload/download-esim-example`, {
                responseType: 'blob',
            }
          );
    } else {
        return await axiosClient.get<ExportRequest, Blob>(
            `${prefixResourceService}/stock-product-serial-upload/download-blank-sim-example`, {
                responseType: 'blob',
            }
          );
    }
};

export const useGetFileTemplate = (isEsim: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_FILE_SIM_TEMPLATE],
      });
      downloadFileFn(data, isEsim ? 'Upload_eSim' : 'Upload_sim', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    },
    onError: (err: IErrorResponse) => {
      if (err?.detail) {
        NotificationError(err?.detail);
      }
    },
  });
};
