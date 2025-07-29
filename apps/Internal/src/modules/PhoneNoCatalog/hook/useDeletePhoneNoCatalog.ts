import { axiosClient } from "apps/Internal/src/service"
import { urlphoneNoCatalog } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { NotificationError, NotificationSuccess } from "@react/commons/Notification"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"
import { MESSAGE } from "@react/utils/message"
import { IErrorResponse } from "@react/commons/types"

const fetcher = async (id: string) => {
    const res = await axiosClient.delete(`${urlphoneNoCatalog}/${id}`)
    return res
}
const useDeletephoneNoCatalog = (onSuccess: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [REACT_QUERY_KEYS.GET_LIST_WAREHOUSE_CATALOG],
            });
            NotificationSuccess(MESSAGE.G03)
            onSuccess()
        },
        onError: (error: IErrorResponse) => {
            if (error.detail) {
                NotificationError(error.detail)
            } 
        }
    })
}
export default useDeletephoneNoCatalog
