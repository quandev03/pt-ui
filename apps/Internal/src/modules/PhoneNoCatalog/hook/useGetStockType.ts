import { axiosClient } from "apps/Internal/src/service"
import { urlphoneNoCatalog } from "../services/url"
import { useQuery } from "@tanstack/react-query"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"

const fetcher = async () => {
    const res = await axiosClient.get<any, any>(`${urlphoneNoCatalog}/combobox/stock-type`)
    return res
}
const useGetStockType = () => {
    return useQuery({
        queryKey: [REACT_QUERY_KEYS.GET_STOCK_TYPE],
        queryFn: () => fetcher(),
        select: (data) => data
    })
}
export default useGetStockType

