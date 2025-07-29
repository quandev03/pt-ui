import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface ItemAccept {
  saveForm: boolean;
  listIds: [];
  passSensor: boolean;
  isLast: boolean;
}

const acceptApi = (data: ItemAccept) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/subscriber-request/accept-request`,
    data
  );
};

export const useAcceptFn = (
  onSuccess: (data: any, variables: ItemAccept) => void,
  onError: (data: any, variables: ItemAccept) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_APPROVE_LIST],
      });
      onSuccess(data, variables);
    },
    onError: (data, variables) => {
      onError(data, variables);
    },
  });
};
