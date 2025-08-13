import { useQuery } from '@tanstack/react-query';
import { IUserInfo } from '@vissoft-react/common';
import { prefixAuthService } from 'apps/Partner/src/constants';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/query-key';
import { safeApiClient } from 'apps/Partner/src/services';

const fetchProfile = async () => {
  const res = await safeApiClient.get<IUserInfo>(
    `${prefixAuthService}/api/auth/profile`
  );
  if (!res) throw new Error('Không thể lấy profile');
  return res;
};
const useGetProfile = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PROFILE],
    queryFn: fetchProfile,
  });
};
export default useGetProfile;
