import { NotificationError, NotificationSuccess } from "@react/commons/Notification"
import { IErrorResponse } from "@react/commons/types"
import { prefixCustomerServicePublic } from "@react/url/app"
import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Partner/src/service"

const sendEmail = ({id, email}:{id?: number, email: string}) => {
    return axiosClient.post<any>(`${prefixCustomerServicePublic}/change-sim-bulk/send-email/${id}?email=${email}`)
}
export const useSendEmail = (onSuccess: () => void) => {
    return useMutation({
        mutationFn: sendEmail,
        onSuccess: () => {
            NotificationSuccess('Gửi lại email thành công')
            onSuccess()
        },
        onError: (err: IErrorResponse) => {
            NotificationError(err.detail)
        }
    })
}