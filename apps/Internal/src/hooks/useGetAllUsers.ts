import { useQuery } from '@tanstack/react-query';
import { prefixAuthService } from '../constants';
import { REACT_QUERY_KEYS } from '../constants/query-key';
import { safeApiClient } from '../services/axios';
type AllUserType =
  | { isPartner: true; clientIdentity: string }
  | { isPartner: false };
type GetALLData = {
  id: string;
  code: string;
  name: string;
  username: string;
  fullname: string;
  status: 0 | 1;
};
const fecth = async (params: AllUserType) => {
  let url = '';
  if (params.isPartner) {
    url = `${prefixAuthService}/api/users/partner/${params.clientIdentity}/all`;
  } else {
    url = `${prefixAuthService}/api/users/internal/all`;
  }
  const res = await safeApiClient.get<GetALLData[]>(url);
  if (!res) throw new Error('Oops');
  return res;
};
export const useGetAllUsers = (params: AllUserType) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => fecth(params),
    enabled: !!params,
  });
};
