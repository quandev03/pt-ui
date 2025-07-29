import { axiosClient } from 'apps/Internal/src/service';
import { ServicePackageItem } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { IErrorResponse } from '@react/commons/types';

const editStatusApi = (data: ServicePackageItem) => {
  return axiosClient.put<any>(
    `${prefixCatalogService}/package-profile/${data.id}/status`
  );
};

export const useEditStatus = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_SERVICE_PACKAGE],
      });
      NotificationSuccess('Cập nhật thành công');
      navigate(pathRoutes.list_of_service_package);
    },
    onError: (err: IErrorResponse) => {
      NotificationError(err?.detail);
    },
  });
};
