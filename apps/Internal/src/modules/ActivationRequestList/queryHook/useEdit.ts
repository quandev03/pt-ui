import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemEdit } from './useAdd';
import { useNavigate } from 'react-router-dom';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const editApi = (data: ItemEdit) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/subscriber-request` + `/${data.id}`,
    data
  );
};

export const useEditFn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: editApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_DEPARTMENT],
      });
      NotificationSuccess('Cập nhật thành công');
      navigate(-1);
    },
    onError: (err) => {
      NotificationError(err?.message);
    },
  });
};
