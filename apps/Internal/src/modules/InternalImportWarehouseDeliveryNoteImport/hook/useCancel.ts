import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from "apps/Internal/src/service"
import { urlInternalWarehouseDeliveryNote } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeyList } from "../../InternalExportWarehouseDeliveryNote/hook/useList"
const fetcher = async (id: string) => {
    const res = await axiosClient.put(`${urlInternalWarehouseDeliveryNote}/cancel-ticket/${id}`)
    return res
}
export const useCancel = (onSuccess: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            NotificationSuccess("Hủy phiếu thành công")
            queryClient.invalidateQueries({ queryKey: [queryKeyList] })
            onSuccess && onSuccess()
        }
    })
}