import { SELECT_SIZE } from '@react/constants/app';
import { prefixAdminService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IUserItem } from '../../UserManagement/types';

export const queryKeyDetailUser = 'query-list-user-internal';

const fetcher = (id: string) => {
  return axiosClient.get<string, IUserItem>(
    `${prefixAdminService}/users/internal/${id}`
  );
};

export const useMutateDetailUser = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
