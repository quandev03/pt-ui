import { prefixAdminService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../service';

export type UserType = {
  id: string;
  username: string;
  fullname: string;
  status: number;
  email: string;
};
export const useGetAllUserKey = 'useGetAllUserKey';
const fetcher = () => {
  return axiosClient.get<string, UserType[]>(
    `${prefixAdminService}/users/internal/all`
  );
};

export const useGetAllUser = (isCall = true) => {
  return useQuery({
    queryKey: [useGetAllUserKey],
    queryFn: () => fetcher(),
    select: (data) => data,
    enabled: isCall,
  });
};
