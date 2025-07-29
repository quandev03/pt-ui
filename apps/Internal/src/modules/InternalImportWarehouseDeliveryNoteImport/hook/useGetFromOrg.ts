import { axiosClient } from "apps/Internal/src/service";
import { IStockOut } from "../type";
import { prefixCatalogService } from "apps/Internal/src/constants/app";
import { useMutation } from "@tanstack/react-query";
const fetcher = async (id: string) => {
    const res = await axiosClient.get<IStockOut, any>(`${prefixCatalogService}/organization-unit/${id}`);
    return res
}
const useGetFromOrg = (onSuccess: (data: any) => void) => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data: any) => {
            onSuccess && onSuccess(data)
        }
    })
}
export default useGetFromOrg
