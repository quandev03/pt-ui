import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from "apps/Internal/src/service"
import { urlDeliveryOrder } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeyList } from "./useList"
import { prefixSaleService } from '@react/url/app';
interface IDataCancel {
    id: string,
    status?: number,
    description?: string
}
const fetcher = async (data: IDataCancel) => {
    const res = await axiosClient.put(`${prefixSaleService}/delivery-order`, data)
    return res
}
export const useCancel = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            NotificationSuccess("Hủy đề nghị thành công")
            queryClient.invalidateQueries({ queryKey: [queryKeyList] })
            onSuccess && onSuccess()
        }
    })
}
