import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IPckAuthorization } from '../types';
import { NotificationSuccess } from '@react/commons/Notification';
import { prefixCatalogService } from '@react/url/app';

const fetcher = async (data: IPckAuthorization) => {
  const res = await axiosClient.post(
    `${prefixCatalogService}/package-attachment`,
    data
  );
  return res;
};

export const useAddPckAuthorization = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Phân quyền gói cước thành công');
      onSuccess && onSuccess();
    },
  });
};
