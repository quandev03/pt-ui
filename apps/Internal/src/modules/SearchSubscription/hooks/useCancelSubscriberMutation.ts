import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { CancelSubscriberRequest } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationSuccess } from '@react/commons/Notification';
import { useIsAdmin } from './useIsAdmin';
import { FormInstance } from 'antd';
import { CommonError } from '@react/commons/types';
import { mapApiErrorToForm } from '@react/helpers/utils';

const fetcher = (params: CancelSubscriberRequest) => {
  const formData = new FormData();
  const data = JSON.stringify(params.data);
  formData.append('data', data);
  formData.append('confirmationLetter', params.confirmationLetter);

  return axiosClient.post<CancelSubscriberRequest, Response>(
    `${prefixCustomerService}/del-subscriber`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const useCancelSubscriberMutation = (form: FormInstance) => {
  const isAdmin = useIsAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      !isAdmin && !!id && navigate(-1);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIPTION],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_SUBSCRIPTION],
      });
      NotificationSuccess('Hủy thuê bao thành công');
    },
    onError: (error: CommonError) => mapApiErrorToForm(form, error.errors),
  });
};
