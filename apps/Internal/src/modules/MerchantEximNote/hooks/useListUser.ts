import { SELECT_SIZE } from '@react/constants/app';
import { prefixAdminService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IUserItem } from '../../UserManagement/types';

export interface Req {
  q: string;
  page: number;
  size: number;
}

interface Res {
  content: IUserItem[];
  totalElements: number;
  size: number;
}

export const queryKeyListUser = 'query-list-user-internal';

const fetcher = (params: Req) => {
  return axiosClient.get<Req, Res>(`${prefixAdminService}/users/internal`, {
    params,
  });
};

export const useMutateListUser = () => {
  return useMutation({
    mutationFn: (keySearch: string) =>
      fetcher({
        q: keySearch,
        page: 0,
        size: SELECT_SIZE,
      }).then(
        (res) =>
          res?.content?.map((e) => ({
            ...e,
            value: e.id,
            label: e.username,
          })) ?? []
      ),
  });
};
