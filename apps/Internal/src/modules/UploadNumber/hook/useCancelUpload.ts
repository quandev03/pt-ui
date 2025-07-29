import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { urlUploadNumber } from '../services/url';
import { NotificationSuccess } from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = async (id: number | string) => {
  const res = await axiosClient.delete(`${urlUploadNumber}/${id}`);
  return res;
};
const useCancelUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Hủy upload tài nguyên số thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_NUMBER],
      });
    },
  });
};
export default useCancelUpload;
