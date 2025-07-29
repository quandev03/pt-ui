import { axiosClient } from "apps/Internal/src/service"
import { urlphoneNoCatalog } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { NotificationSuccess } from "@react/commons/Notification"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"
import { MESSAGE } from "@react/utils/message"
import { FormInstance } from "antd"
import { CommonError, FieldErrorsType } from "@react/commons/types"
import { IDataPayloadPhoneNoCatalog } from "../type"

const fetcher = async (data: IDataPayloadPhoneNoCatalog) => {
    const res = await axiosClient.post(`${urlphoneNoCatalog}`, data)
    return res
}
export const useAddphoneNoCatalog = (onSuccess: () => void, form: FormInstance<any>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            NotificationSuccess(MESSAGE.G01)
            queryClient.invalidateQueries({
                queryKey: [REACT_QUERY_KEYS.GET_LIST_WAREHOUSE_CATALOG],
            });
            onSuccess()
        },
        onError: (err: CommonError) => {
            if (err?.errors?.length > 0) {
                form.setFields(
                    err?.errors?.map((item: FieldErrorsType) => ({
                        name: item.field,
                        errors: [item.detail],
                    }))
                );
            }
        },
    })
}
