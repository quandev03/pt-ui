import { useQuery } from '@tanstack/react-query';
import { prefixAuthServicePrivate } from '../constants/app';
import { REACT_QUERY_KEYS } from '../constants/querykeys';
import { axiosClient } from '../service';

interface DataResponse {
  id: string;
  username: string;
  fullname: string;
  status: number;
  phoneNumber: string;
}
type UsersByPermissionType = {
  permission: string[];
};
const getUsersByPermission = async (params: UsersByPermissionType) => {
  const queryParams = new URLSearchParams();
  params.permission.forEach((value: string): void => {
      queryParams.append('permission', value);
  });
  const res = await axiosClient.get<any, DataResponse[]>(
    `${prefixAuthServicePrivate}/api/users/internal/all`, {params: queryParams}
  );
  if (!res) throw new Error('Oops');
  return res;
};
export const useGetUsersByPermission = (params: UsersByPermissionType) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_USERS_BY_PERMISSION, params],
    queryFn: () => {
      return getUsersByPermission(params);
    },
  });
};
