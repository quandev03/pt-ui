import { useQuery } from "@tanstack/react-query"
import { getStockIsdn } from "../services"
import { QUERY_KEY } from "../constant"

export const useGetStockIsdn = () => {
    return useQuery({
        queryFn: getStockIsdn,
        queryKey: [QUERY_KEY.GET_HISTORY_ISDN],
        select: (data: any) => {
            return data?.map((item: any) => {
                return {
                    value: item.code,
                    label: item.value
                }
            })
        }
    })
}