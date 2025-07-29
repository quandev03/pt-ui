import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixAuthServicePublic } from 'apps/Partner/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { axiosClient } from 'apps/Partner/src/service';

interface Res {
  data: { contractId: string };
}
export const queryKeyProfile = 'query-edit-profile-personal';

const fetcher = (payload: Record<string, string>) => {
  return axiosClient.patch<string, Res>(
    `${prefixAuthServicePublic}/api/auth/profile`,
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
