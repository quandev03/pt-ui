import { axiosClient } from "apps/Internal/src/service"
import { urlStockOutForDistributor } from "../services/url"
import { useQuery } from "@tanstack/react-query"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"

const fetcher = async (id: string) => {
    const res = await axiosClient.get<any, any>(`${urlStockOutForDistributor}/${id}`)
    return res
}
const useGetDetailStockOutForDistributor = (id: string) => {
    return useQuery({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_STOCK_OUT_FOR_DISTRIBUTOR, id],
        queryFn: () => fetcher(id),
        select: (data) => data,
        enabled: !!id
    })
}
export default useGetDetailStockOutForDistributor