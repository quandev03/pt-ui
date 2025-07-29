import { prefixAuthServicePrivate } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

interface Res {
  data: { contractId: string };
}
export const queryKeyProfile = 'query-edit-profile-personal';

const fetcher = (payload: any) => {
  return axiosClient.patch<any, Res>(
    `${prefixAuthServicePrivate}/api/auth/profile`,
    payload
  );
};

export const useEditProfile = () => {
  return useMutation({
    mutationKey: [queryKeyProfile],
    mutationFn: fetcher,
  });
};
