import { NotificationSuccess } from "@react/commons/Notification"
import { CommonError, FieldErrorsType } from "@react/commons/types"
import { MESSAGE } from "@react/utils/message"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormInstance } from "antd"
import { axiosClient } from "apps/Internal/src/service"
import { urlInternalImportExportWarehouse } from "../services/url"
import { queryKeyList } from "./useList"
import { TenMinutes } from "@react/constants/app"

const fetcher = async (data: any) => {
    const res = await axiosClient.post(`${urlInternalImportExportWarehouse}`, data,
      {
        timeout: TenMinutes 
      }
    )
    return res
}
const useAddImport = (onSuccess: () => void, form: FormInstance) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeyList] })
            NotificationSuccess(MESSAGE.G01);
            onSuccess && onSuccess()
        },
        onError: (err: any) => {
          if (err?.errors?.length > 0) {
            form.setFields(
              err.errors.map((item: FieldErrorsType) => {
                const fieldArr = item.field.split('-');
                const productId = fieldArr[0];
                const index = form
                  .getFieldValue('products')
                  .findIndex(
                    (item: any) =>
                      String(item.productId) === String(productId)
                  );
                return {
                  name: ['products', index, 'quantity'],
                  errors: [item.detail],
                };
              })
            );
          }
        },
    })
}
export default useAddImport;



