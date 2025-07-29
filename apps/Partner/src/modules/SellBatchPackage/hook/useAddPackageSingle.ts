import { NotificationError, NotificationSuccess } from "@react/commons/Notification"
import { MESSAGE } from "@react/utils/message"
import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Partner/src/service"
import { urlSellBatchPackage } from "../service/url"
import { IPayloadRegister } from "../type"
import { AnyElement, FieldErrorsType, IErrorResponse } from "@react/commons/types"
import form from "@react/utils/form"
import { FormInstance } from "antd"
const fetcher = async(data: AnyElement)=>{
    const formData = new FormData();
    formData.append('attachment', data.attachment);
    formData.append(
        'otpConfirmRequest',
        new Blob([JSON.stringify(data.otpConfirmRequest)], {
          type: 'application/json',
        })
      );
    const res = await axiosClient.post<IPayloadRegister,IPayloadRegister>(`${urlSellBatchPackage}/submit-data`,
        formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return res
}
const useAddPackageBatch = (onSuccess: () => void,form:FormInstance)=>{
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
export default useAddPackageBatch;