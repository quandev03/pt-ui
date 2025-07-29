import { NotificationError, NotificationSuccess } from "@react/commons/Notification"
import { MESSAGE } from "@react/utils/message"
import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Partner/src/service"
import { urlSellSinglePackage } from "../service/url"
import { IPayloadRegister } from "../type"
import { AnyElement, FieldErrorsType } from "@react/commons/types"
import { FormInstance } from "antd"
const fetcher = async(data: IPayloadRegister)=>{
    const res = await axiosClient.post<IPayloadRegister,IPayloadRegister>(`${urlSellSinglePackage}/register-package`,data)
    return res
}
const useAddPackageSingle = (onSuccess: () => void,form:FormInstance)=>{
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
           NotificationSuccess(MESSAGE.G01);
           onSuccess && onSuccess(); 
        },
        onError: (error: AnyElement) => {
            if (error.errors && error.errors.length > 0) {
                form.setFields(
                  error.errors.map((e: FieldErrorsType) => ({
                    name: e.field,
                    errors: [e.detail],
                  }))
                );
              }
        },
    })
}
export default useAddPackageSingle;