import { urlDeliveryOrder } from '../services/url';
import { useMutation } from '@tanstack/react-query';
import { AnyElement } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = async (data: { deliveryOrderDTO: any; attachmentFiles: { files: Blob[] } }) => {
  const formData = new FormData()
  formData.append("deliveryOrderDTO", new Blob([JSON.stringify(data.deliveryOrderDTO)], {
    type: 'application/json',
  }))
  data.attachmentFiles.files.forEach((item: Blob) => {
    formData.append('attachmentFiles', item);
  });
  const res = await axiosClient.post(`${urlDeliveryOrder}/create-ticket-out`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res
}
const useAdd = (onSuccess: (data: AnyElement) => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: AnyElement) => {
      NotificationSuccess(MESSAGE.G01)
      onSuccess && onSuccess(data)
    }
  })
}
export default useAdd;
