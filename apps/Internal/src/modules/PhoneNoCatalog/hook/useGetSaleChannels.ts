import { prefixCatalogServicePublic } from "@react/url/app"
import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
import { ISaleChannels } from "../type"
const queryKey = "GET_SALE_CHANNELS"
const fetcher = async () => {
    const res = await axiosClient.get<ISaleChannels, any>(`${prefixCatalogServicePublic}/stock-isdn-org/combobox/sales-channels`)
    return res.content
}

export const useGetSaleChannels = () => {
    return useQuery(
        {
            queryKey: [queryKey],
            queryFn: fetcher,
            select: (data) => {
                return data.filter((item: ISaleChannels) => item.status).map((item: ISaleChannels) => {
                    return {
                        label: item.channelName,
                        value: String(item.channelCode)
                    }
                })
            },
        }
    )
}