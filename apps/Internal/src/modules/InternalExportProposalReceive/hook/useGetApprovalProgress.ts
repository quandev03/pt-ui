import { useMutation } from "@tanstack/react-query"
import { versionApi } from "apps/Internal/src/constants/app";
import { axiosClient } from "apps/Internal/src/service"
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
export const urlApprovalServicePublic =
    'approval-service/public/api' + versionApi;
const fetcher = async (data: IPayload) => {
    const res = await axiosClient.post<string, IDataApprovalProgress>(`${urlApprovalServicePublic}/approval/approval-process-step`, data)
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