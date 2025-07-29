import { useQuery } from "@tanstack/react-query"
import { getStatus } from "../services"
import { QUERY_KEY } from "../constant";
import { IStatus } from "../type";

export const useGetTransferStatus = (params: IStatus) => {
    return useQuery({
        queryFn: () => getStatus(params),
        queryKey: [QUERY_KEY.GET_TRANSFER_STATUS, params],
        select: (data: any) => {
            return data.map((item: any) => {
                return {
                    value: item.code,
                    label: item.value
                }
            })
        }
    })
}