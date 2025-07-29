import { useQuery } from "@tanstack/react-query"
import { getOrganizationCurrent } from "../services"
import { QUERY_KEY } from "./key"

export const useGetOranizationCurrent = () => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_ORGANZITAION_CURRENT],
        queryFn: getOrganizationCurrent,
        select: (data: any) => {
            const option = [{
                value: data.id,
                label: data.name,
            }]
            return option ;
        }
    })
}