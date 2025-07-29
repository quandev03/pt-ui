import { NotificationSuccess } from "@react/commons/Notification"
import { prefixSaleServicePrivate } from "@react/url/app"
import { MESSAGE } from "@react/utils/message"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
import { IPayload } from "../type"
import { queryKeyList } from "./useList"
const fetcher = async (data: IPayload) => {
    const formData = new FormData()
    const url = `${prefixSaleServicePrivate}/organization-airtime-transaction`
    formData.append("request", new Blob([JSON.stringify(data.request)], {
        type: 'application/json',
    }))
    data.attachmentFiles.files.forEach((item: any) => {
        formData.append('attachmentFiles', item as Blob);
    });
    const res = await axiosClient.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return res
}
export const useAdd = (onSuccess: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: IPayload) => fetcher(data),
        onSuccess: () => {
            NotificationSuccess(MESSAGE.G01)
            queryClient.invalidateQueries({
                queryKey: [queryKeyList],
            });
            onSuccess && onSuccess()
        },
    })
}