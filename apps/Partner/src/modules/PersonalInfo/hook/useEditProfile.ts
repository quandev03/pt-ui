import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixAuthService } from 'apps/Partner/src/constants';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/query-key';
import { safeApiClient } from 'apps/Partner/src/services';

interface Res {
  data: { contractId: string };
}
export const queryKeyProfile = 'query-edit-profile-personal';

const fetcher = (payload: Record<string, string>) => {
  return safeApiClient.patch<Res>(
    `${prefixAuthService}/api/auth/profile`,
    payload
  );
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyProfile],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_PROFILE],
      });
    },
  });
};
