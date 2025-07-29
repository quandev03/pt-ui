import { useQuery } from "@tanstack/react-query"
import { getStatus } from "../services"
import { QUERY_KEY } from "../constant";
import { IStatus } from "../type";

export const useGetStatus = (params: IStatus) => {
    return useQuery({
        queryFn: () => getStatus(params),
        queryKey: [QUERY_KEY.GET_STATUS, params],
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