import { NotificationSuccess } from '@react/commons/Notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const editStatusApi = (data: { id: number; channel: string }) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/application-config/set-application-config?id=${data.id}&channel=${data.channel}`
  );
};
export const useEditStatus = (Key: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Key],
      });
      NotificationSuccess('Cập nhật thành công');
    },
  });
};
