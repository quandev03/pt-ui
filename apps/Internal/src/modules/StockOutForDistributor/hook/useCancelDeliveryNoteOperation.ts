import { axiosClient } from "apps/Internal/src/service"
import { urlStockOutForDistributor } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"
import { NotificationSuccess } from "@react/commons/Notification"

const fetcher = async (id: string) => {
    const res = await axiosClient.put(`${urlStockOutForDistributor}/${id}?status=3`)
    return res
}
const useCancelDeliveryNoteOperation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            NotificationSuccess("Hủy phiếu xuất nhập kho cho NPP thành công")
            queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.GET_LIST_STOCK_OUT_FOR_DISTRIBUTOR] })
            onSuccess && onSuccess()
        }
    })
}
export default useCancelDeliveryNoteOperation