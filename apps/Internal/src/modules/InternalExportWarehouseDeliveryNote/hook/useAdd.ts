import { axiosClient } from "apps/Internal/src/service"
import { urlInternalWarehouseDeliveryNote } from "../services/url"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { NotificationSuccess } from "@react/commons/Notification"
import { MESSAGE } from "@react/utils/message"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"

const fetcher = async (data: any) => {
  const formData = new FormData()
  const deliveryNote = {
    fromOrgId: data.fromOrgId,
    reasonId: data.reasonId,
    toOrgId: data.toOrgId,
    description: data.description,
    deliveryOrderId: data.deliveryOrderId,
    attachments: data.attachments,
    deliveryNoteType: data.deliveryNoteType,
    deliveryNoteMethod: data.deliveryNoteMethod,
    deliveryNoteDate: data.deliveryNoteDate,
    deliveryNoteLines: data.deliveryNoteLines,
    deliveryOrderDate: data.deliveryOrderDate,
  }

  formData.append("deliveryNote", new Blob([JSON.stringify(deliveryNote)], {
    type: 'application/json',
  }))
  data.files.forEach((item: any) => {
    formData.append('attachments', item as Blob);
  });
  const res = await axiosClient.post(`${urlInternalWarehouseDeliveryNote}/create-ticket-out`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res
}


const useAdd = (onSuccess: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => fetcher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.GET_LIST_STOCK_OUT_FOR_DISTRIBUTOR] })
      NotificationSuccess(MESSAGE.G01);
      onSuccess && onSuccess()
    }
  })
}
export default useAdd;



