import { axiosClient } from "apps/Internal/src/service"
import { urlphoneNoCatalog } from "../services/url"
import { useMutation } from "@tanstack/react-query"
import { IListPhoneNoCatalog } from "../type"

const fetcher = async (id: string) => {
    const res = await axiosClient.get<string, IListPhoneNoCatalog>(`${urlphoneNoCatalog}/${id}`)
    return res
}
const useGetDetailphoneNoCatalog = (onSuccess: (data: IListPhoneNoCatalog) => void) => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data) => {
            onSuccess(data)
        }
    })
}
export default useGetDetailphoneNoCatalog