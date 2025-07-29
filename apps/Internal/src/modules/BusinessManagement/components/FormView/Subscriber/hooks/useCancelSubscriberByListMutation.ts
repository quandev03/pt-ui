import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { CancelSubscriberByListRequest } from '../types';
import { prefixCustomerService } from '@react/url/app';
import { NotificationSuccess } from '@react/commons/Notification';

const fetcher = (params: CancelSubscriberByListRequest) => {
  return axiosClient.post<CancelSubscriberByListRequest, Response>(
    `${prefixCustomerService}/del-subscriber-by-list`,
    params
  );
};

export const useCancelSubscriberByListMutation = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess(
        'Hệ thống đang xử lý hủy danh sách thuê bao. Vui lòng theo dõi kết quả tại màn báo cáo tác động thuê bao theo file KHDN'
      );
    },
  });
};
