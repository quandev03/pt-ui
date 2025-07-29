import { prefixSaleService } from "@react/url/app"
import { useMutation, useQuery } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
import { IStockPeriod } from "../type"
export interface IParamsStockPeriod {
    orgId: string
    endDate: string
}
const fetcher = async (params: IParamsStockPeriod) => {
    const res = await axiosClient.get<IStockPeriod[],any>(`${prefixSaleService}/stock-period/search`, { params })
    return res.content
}
export const useGetSearchStockPeriod = (onSuccess?: (data: IStockPeriod[]) => void) => {
   return useMutation({
        mutationFn: fetcher,
        onSuccess: (data) => {
           onSuccess && onSuccess(data)
        }
    })
}