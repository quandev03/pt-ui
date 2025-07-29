import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { urlInternalWarehouseDeliveryNote } from '../services/url';
const fetcher = async (id: string) => {
    const res = await axiosClient.get<any, any>(`${urlInternalWarehouseDeliveryNote}/${id}`)
    return res
}
const useGetDetailDeliveryNote = (onSuccess: (data: any) => void) => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data: any) => {
            onSuccess && onSuccess(data)
        }
    })
}
export default useGetDetailDeliveryNote

