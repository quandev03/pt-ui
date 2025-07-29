import { axiosClient } from "apps/Internal/src/service"
import { urlRevokeNumber } from "../services"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { NotificationSuccess } from "@react/commons/Notification"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"

const fetcher = async (id: number) => {
    const res = await axiosClient.post(`${urlRevokeNumber}/cancel/${id}`)
    return res
}
const useCancel = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [REACT_QUERY_KEYS.GET_LIST_REVOKE_NUMBER]
            })
            NotificationSuccess("Hủy thu hồi thành công")
            onSuccess && onSuccess()
        }
    })
}
export default useCancel
