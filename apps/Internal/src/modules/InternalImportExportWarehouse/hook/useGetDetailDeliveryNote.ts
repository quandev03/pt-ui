import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IDataDetailInternalExportProposal } from '../type';
import { prefixSaleService } from '@react/url/app';
const urlDeliveryNote = `${prefixSaleService}/delivery-note`
const fetcher = async (id: string) => {
    const res = await axiosClient.get<IDataDetailInternalExportProposal, any>(`${urlDeliveryNote}/${id}`)
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

