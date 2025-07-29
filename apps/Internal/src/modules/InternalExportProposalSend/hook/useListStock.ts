import { axiosClient } from "apps/Internal/src/service";
import { IOrganizationUnitDTO } from "../type";
import { prefixCatalogService } from "@react/url/app";
import { useQuery } from "@tanstack/react-query";
const queryKey = 'list-stock'
const fetcher = async () => {
    const dataListStock = await axiosClient.get<IOrganizationUnitDTO, IOrganizationUnitDTO[]>(`${prefixCatalogService}/organization-unit`);
    return dataListStock;
};

export const useListStock = (enabled: boolean) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: () => fetcher(),
        enabled: enabled
    })
}