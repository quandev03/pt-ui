import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from 'apps/Internal/src/service';
import { NotificationSuccess } from '@react/commons/Notification';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { IPayloadConfirm } from '../types';

const editApi = (payload: IPayloadConfirm) => {
  return axiosClient.post<any>(
    `${prefixCustomerService}/doc-update/confirm?subDocumentId=${payload.id}`,
    payload
  );
};

export const useApproveSubdocument = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editApi,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      navigate(pathRoutes.verificationListStaff);
    },
  });
};
