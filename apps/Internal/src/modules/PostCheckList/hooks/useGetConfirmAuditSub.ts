import { axiosClient } from 'apps/Internal/src/service';
import { urlPostCheckList } from '../services/url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IDataConfirmAuditSub } from '../types';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { useNavigate } from 'react-router-dom';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = async (data: IDataConfirmAuditSub) => {
  const res = await axiosClient.post(
    `${urlPostCheckList}/confirm-audit-sub`,
    data
  );
  return res;
};
export const useGetConfirmAuditSub = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_POST_CHECK_LIST],
      });
      NotificationSuccess(MESSAGE.G02);
      navigate(-1);
    },
  });
};
