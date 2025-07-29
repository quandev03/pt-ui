import { prefixSaleService } from "@react/url/app";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
import { REACT_QUERY_KEYS } from "../constants/querykeys";

const fetch = async (id: string)=>{
    const res = await axiosClient.get<string,string>(`${prefixSaleService}/decrypt-operations/${id}`)
    return res
}
export const useDecryptOperationsId = (id: string, enabled:boolean= true)=>{
    return useQuery({
        queryKey: [REACT_QUERY_KEYS.DECRYPT_OPERATIONS_ID, id],
        queryFn: () => fetch(id),
        enabled: !!id && enabled
    })
}