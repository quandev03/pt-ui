import { useQuery } from "@tanstack/react-query";
import { prefixSaleService } from "apps/Internal/src/constants/app";
import { axiosClient } from "apps/Internal/src/service";
import { IStockIn } from "../type";
const queryKey = "GET_STOCK_OUT_INTERNAL_WAREHOUSE_DELIVERY_NOTE"
const fetcher = async () => {
    const res = await axiosClient.get<IStockIn, any>(`${prefixSaleService}/organization-user/get-organization-current`);
    return res
}
const useGetStockOut = () => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: fetcher,
        select: (data) => data.id
    })
}
export default useGetStockOut