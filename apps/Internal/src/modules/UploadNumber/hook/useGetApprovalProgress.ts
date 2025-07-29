import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
import { prefixApprovalServicePublic } from '@react/url/app';
export interface IPayload {
    id?: string;
    objectName: string,
    recordId: string;
}
export interface IDataApprovalProgress {
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    status: number;
    approvedUserId: string;
    description?: string;
    approvalHistoryId: number;
    stepOrder?: string;
    approvedUserName?: string;
    mandatorUserId?: string;
    mandatorUserName?: string;
    step_id?: string;
    approval_date?: string;
    approval_user_name?: string;
}

const fetcher = async (data: IPayload) => {
    const res = await axiosClient.post<string, IDataApprovalProgress>(`${prefixApprovalServicePublic}/approval/approval-process-step`, data)
    return res
}
const useGetApprovalProgress = () => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data) => {
            console.log(data)
        },
    })
}
export default useGetApprovalProgress
