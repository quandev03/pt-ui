import { prefixCatalogServicePublic } from "@react/url/app"
import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
const queryKey = "GET_STOCK_CURRENT_USER"
const fetcher = async () => {
    const res = await axiosClient.get<any, any>(`${prefixCatalogServicePublic}/organization-user/get-all-organization-by-user`)
    return res
}
const useGetStockCurrentUser = (enabled: boolean) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: fetcher,
        select: (data) => data,
        enabled: enabled
    })
}
export default useGetStockCurrentUser
