import { axiosClient } from 'apps/Internal/src/service';
import { urlPostCheckList } from '../services/url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IDataReAppoval } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { NotificationSuccess } from '@react/commons/Notification';

const fetcher = async (data: IDataReAppoval) => {
  const res = await axiosClient.put(
    `${urlPostCheckList}/re-list-approval-status`,
    data
  );
  return res;
};
const useListReAppoval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_POST_CHECK_LIST],
      });
      NotificationSuccess('Phân công kiểm duyệt lại thành công');
    },
  });
};
export default useListReAppoval;
