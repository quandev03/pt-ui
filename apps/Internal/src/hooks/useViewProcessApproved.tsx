import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixApprovalServicePublic } from '@react/url/app';

export interface Payload {
  id?: number;
  objectName?: string;
  recordId?: number;
}
export interface IDataViewProcessApproved {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  status: number;
  approvedUserId: string;
  description?: any;
  approvalHistoryId: number;
  stepOrder?: any;
  approvedUserName?: any;
  mandatorUserId?: any;
  mandatorUserName?: any;
  step_id?: any;
  approval_date?: any;
  approval_user_name?: any;
}

const fetcher = (payload: Payload) => {
  return axiosClient.post<string, IDataViewProcessApproved[]>(
    `${prefixApprovalServicePublic}/approval/approval-process-step`,
    payload
  );
};

export const useViewProcessApproved = (
  onSuccess?: (data: IDataViewProcessApproved[]) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess(data) {
      onSuccess && onSuccess(data);
    },
  });
};
