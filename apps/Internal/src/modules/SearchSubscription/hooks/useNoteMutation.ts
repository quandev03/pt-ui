import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { NoteRequest } from '../types';
import { NotificationSuccess } from '@react/commons/Notification';
import { prefixCustomerService } from '@react/url/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = (params: NoteRequest) => {
  return axiosClient.post<string, Response>(
    `${prefixCustomerService}/search-request/note/${params.id}`,
    { note: params.note }
  );
};

export const useNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIPTION],
      });
      NotificationSuccess('Cập nhật ghi chú thành công');
    },
  });
};
