import { prefixCatalogServicePublic } from "@react/url/app"
import { useQuery } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Partner/src/service"
import { IWarehouse } from "../types"

const queryKeyListWarehouse = "query-list-warehouse"
const fetcher = async () => {
    const res = await axiosClient.get<any, IWarehouse[]>(`${prefixCatalogServicePublic}/organization-user/get-all-organization-by-user`)
    return res
}
export const useListWarehouse = () => {
   return useQuery({
    queryKey: [queryKeyListWarehouse],
    queryFn: fetcher,
    select: (data) => data
   })
}

