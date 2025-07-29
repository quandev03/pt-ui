import { NotificationSuccess } from "@react/commons/Notification"
import { prefixSaleServicePrivate } from "@react/url/app"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
import { queryKeyList } from "./useList"
const fetcher = async (id: number) => {
    const url = `${prefixSaleServicePrivate}/organization-airtime-transaction/${id}`
    const res = await axiosClient.delete(url)
    return res
}
export const useDelete = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            NotificationSuccess("Hủy giao dịch thành công")
            queryClient.invalidateQueries({
                queryKey: [queryKeyList],
            });
            onSuccess && onSuccess()
        },
    })
}