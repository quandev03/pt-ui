import { NotificationSuccess } from '@react/commons/index';
import { prefixApprovalServicePublic } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';


interface Res {
  data: { contractId: string };
}
export const queryKeyApprovalDelegate = 'query-edit-approval-process-personal';

const fetcher = (payload: any) => {
  return axiosClient.post<any, Res>(
    `${prefixApprovalServicePublic}/approval-delegate`,
    payload
  );
};

export const useEditApprovalDelegate = () => {
  return useMutation({
    mutationKey: [queryKeyApprovalDelegate],
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
    },
  });
};
