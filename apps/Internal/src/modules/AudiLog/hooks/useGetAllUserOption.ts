import { prefixAdminService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const useGetAllUserOptionKey = 'useGetAllUserOptionKey';

export interface IUser {
  id: string;
  username: string;
  fullname: string;
  status: number;
  email: string;
}

const fetcher = (clientIdentity: string) => {
  if (clientIdentity) {
    return axiosClient.get<string, IUser[]>(
      `${prefixAdminService}/users/partner/${clientIdentity}/all`
    );
  }
  return axiosClient.get<IUser, IUser[]>(
    `${prefixAdminService}/users/internal/all`
  );
};

export const useGetAllUserOption = (params: string) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [useGetAllUserOptionKey, params],
    select(data) {
      return data.map((item) => ({
        label: item.fullname,
        value: item.id,
      }));
    },
  });
};
