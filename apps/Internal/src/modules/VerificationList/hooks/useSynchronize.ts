import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';

interface ISynchronizePayload {
  subDocumentId: string;
  isdn: string;
  serialSim: string;
}
const synchronizeApi = (data: ISynchronizePayload) => {
  return axiosClient.post<any>(
    `${prefixCustomerService}/synchronize-information`,
    data
  );
};

export const useSynchronize = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: synchronizeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_CENSORSHIP_LIST_FOR_STAFF],
      });
      NotificationSuccess('Đồng bộ thông tin thành công');
      navigate(-1);
    },
    onError: (err: IErrorResponse) => {
      NotificationError(err.detail);
    },
  });
};
