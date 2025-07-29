import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
import { prefixCatalogServicePublic } from "@react/url/app";
import { IDataDetaiOrgPartner } from "../type";

const fetcher = async (id:string) => {
    const res = await axiosClient.get<string,IDataDetaiOrgPartner>(`${prefixCatalogServicePublic}/organization-unit/${id}`)
    return res
}
const useDetailPartner = (onSuccess?: (data: IDataDetaiOrgPartner) => void) => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data: IDataDetaiOrgPartner) =>{
            onSuccess && onSuccess(data)
        }
    })
}
export default useDetailPartner;