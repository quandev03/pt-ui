import { prefixAdminService } from '@react/url/app';
import { axiosClient } from '../service';
import { UserType } from './useGetAllUser';
import { useQuery } from '@tanstack/react-query';

type IGetUserParams = {
  isPartner?: boolean;
  q?: string;
};
const fetcher = (params: IGetUserParams) => {
  return axiosClient.get<IGetUserParams, UserType[]>(
    `${prefixAdminService}/users/all`,
    { params }
  );
};
export const useGetInterPartnerUsers = (params: IGetUserParams) => {
  return useQuery({
    queryKey: ['useGetInterPartnerUser', params],
    queryFn: () => fetcher(params),
  });
};
