import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Partner/src/service"
import { IPayloadGenOtp, IResGenOtp } from "../type"
import { urlSellBatchPackage } from "../service/url"
const fetcher = async(data:IPayloadGenOtp)=>{
    const res = await axiosClient.post<IResGenOtp,IResGenOtp>(`${urlSellBatchPackage}/gen-otp`,data)
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