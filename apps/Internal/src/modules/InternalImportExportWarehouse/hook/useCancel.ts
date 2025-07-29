import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from "apps/Internal/src/service"
import { urlInternalImportExportWarehouse } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeyList } from "./useList"
const fetcher = async (id: string) => {
    const res = await axiosClient.put(`${urlInternalImportExportWarehouse}/${id}?status=3`)
    return res
}
export const useCancel = (onSuccess: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            NotificationSuccess("Hủy giao dịch thành công")
            queryClient.invalidateQueries({ queryKey: [queryKeyList] })
            onSuccess && onSuccess()
        }
    })
}