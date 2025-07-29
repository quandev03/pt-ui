import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';

const fetcher = (data: any) => {
  return axiosClient.post(
    `${prefixSaleService}/stock-move/ticket-out`,
    data
  );
};

export const useAddEximDistributor = (form: FormInstance, onError: (data: any)=> void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_EXIM_DISTRIBUTOR],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_DELIVERY_NOTE],
      });
      NotificationSuccess(MESSAGE.G01);
      if (form.getFieldValue('saveForm')) {
        form.resetFields();
      } else {
        navigate(-1);
      }
    },
    onError: (error: any) => {
      onError(error)
    }
  });
};
