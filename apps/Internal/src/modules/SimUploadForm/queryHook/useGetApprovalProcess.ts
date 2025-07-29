import { useMutation } from '@tanstack/react-query';
import { prefixApprovalPublic } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { IApprovalInfo, IApprovalProcessPayload } from '../types';

const getApprovalProcess = (id: number) => {
  console.log('call');
  return axiosClient.post<IApprovalProcessPayload, IApprovalInfo[]>(
    `${prefixApprovalPublic}/approval/approval-process-step`,
    { recordId: id, objectName: 'STOCK_PRODUCT_UPLOAD_ORDER' }
  );
};
export const useGetApprovalProcess = () => {
  return useMutation({
    mutationFn: getApprovalProcess,
  });
};
