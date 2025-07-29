import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface ItemAssign {
  saveForm: boolean;
  listIds: [];
  approveUser: string;
}

const assignApi = (data: ItemAssign) => {
  return axiosClient.post<any>(
    `${prefixCustomerService}/subscriber-request/add-approve`,
    data
  );
};

export const useAssignFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: assignApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_ASSIGN_LIST],
      });
      // console.log("DAATTTTTTTTTTTTT",data);

      if (data.length === 1) {
        NotificationSuccess(`Phân công hồ sơ cần tiền kiểm thành công!`);
      } else {
        NotificationSuccess(
          `Phân công ${data.length} hồ sơ cần tiền kiểm thành công!`
        );
      }
      // NotificationSuccess(`Phân công jghgfg hồ sơ cần tiền kiểm thành công!`);

      form.resetFields();
    },
    onError: (err) => {
      if (err?.message) {
        NotificationError(err?.message);
      }
    },
  });
};
