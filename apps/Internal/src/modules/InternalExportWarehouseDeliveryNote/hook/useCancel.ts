import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from "apps/Internal/src/service"
import { urlInternalWarehouseDeliveryNote } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeyList } from "./useList"
import { DeliveryOrderStatusList } from '@react/constants/status';
export enum StatusCancel {
    CANCELLED = 3
}
const fetcher = async (id: string) => {
    const res = await axiosClient.put(`${urlInternalWarehouseDeliveryNote}/${id}?status=${StatusCancel.CANCELLED}`)
    return res
}
export const useCancel = (onSuccess: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeyList] })
            onSuccess && onSuccess()
        }
    })
}