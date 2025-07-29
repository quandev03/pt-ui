import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Partner/src/service"
import { urlSellSinglePackage } from "../service/url"
import { IPackage, IPayloadCheckIsdnAndGetPackage } from "../type"
const fetcher = async(payload:IPayloadCheckIsdnAndGetPackage)=>{
    const res = await axiosClient.get<IPackage,IPackage[]>(`${urlSellSinglePackage}/check-isdn`,{
        params: payload
    })
    return res
}
const useCheckIsdnAndGetPackage = (onSuccess: (data: IPackage[]) => void)=>{
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data) => {
           onSuccess(data)
        }   
    })
}
export default useCheckIsdnAndGetPackage;