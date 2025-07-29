import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from 'apps/Internal/src/service';
import { NotificationSuccess } from '@react/commons/Notification';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

interface Req {
  isdn: string;
  approveRejectReasonCode: string;
  approveRejectNote: string;
  subDocumentId: string;
}

const fetcher = (data: Req) => {
  return axiosClient.post<any, Req>(
    `${prefixCustomerService}/require-customer-update`,
    data
  );
};

export const useRequireCustomerUpdate = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      navigate(-1);
    },
  });
};
