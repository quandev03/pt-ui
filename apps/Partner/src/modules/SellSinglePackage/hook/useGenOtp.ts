import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Partner/src/service"
import { urlSellSinglePackage } from "../service/url"
import { IPayloadGenOtp, IResGenOtp } from "../type"
const fetcher = async(data:IPayloadGenOtp)=>{
    const res = await axiosClient.post<IResGenOtp,IResGenOtp>(`${urlSellSinglePackage}/gen-otp`,data)
    return res
}
const useGenOtp = (onSuccess: (data: IResGenOtp) => void)=>{
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data) => {
           onSuccess(data)
        }   
    })
}
export default useGenOtp;