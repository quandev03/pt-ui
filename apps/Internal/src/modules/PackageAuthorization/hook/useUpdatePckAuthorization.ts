import { axiosClient } from 'apps/Internal/src/service';
import { IPckAuthorization } from '../types';
import { useMutation } from '@tanstack/react-query';
import { NotificationSuccess } from '@react/commons/Notification';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = async (data: IPckAuthorization) => {
  const res = await axiosClient.put(
    `${prefixCatalogService}/package-attachment/${data.pckId}`,
    data
  );
  return res;
};

export const useUpdatePckAuthorization = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Phân quyền gói cước thành công');
      onSuccess && onSuccess();
    },
  });
};
