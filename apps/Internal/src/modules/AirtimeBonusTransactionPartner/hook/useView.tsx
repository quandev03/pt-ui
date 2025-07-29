import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
import { prefixSaleServicePrivate } from "@react/url/app";

export const queryKeyList = "airtime-bonus-transactions-partner-view";
const fetcher = async (id:string) => {
    const res = await axiosClient.get<any, any>(`${prefixSaleServicePrivate}/organization-airtime-transaction/${id}`)
    return res
}
const useView = (id:string) => {
    return useQuery({
        queryKey: [queryKeyList, id],
        queryFn: () => fetcher(id),
        select: (data) => data,
        enabled:!!id
    })
}
export default useView;