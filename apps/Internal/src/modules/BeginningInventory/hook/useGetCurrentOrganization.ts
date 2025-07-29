import { prefixCatalogServicePublic } from "@react/url/app"
import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
interface IOrganization {
    orgId: string;
    orgName: string;
    isCurrent: boolean;
    orgCode: string;

}
const fetcher = async () => {
    const res = await axiosClient.get<IOrganization, any>(`${prefixCatalogServicePublic}/organization-user/get-all-organization-by-user`)
    return res
}
export const useGetCurrentOrganization = () => {
    return useQuery({
        queryKey: ["report-inventory-current-organization"],
        queryFn: fetcher,
        select: (data) => {
            return data.map((item: IOrganization) => ({
                value: String(item.orgId),
                label: item.orgName
            }))
        }
    })
}