import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { urlInternalImportExportWarehouse } from '../services/url';
const fetcher = async (id: string) => {
    const res = await axiosClient.get<any, any>(`${urlInternalImportExportWarehouse}/${id}`)
    return res
}
const useGetDetailTransactionExport = (onSuccess: (data: any) => void) => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data: any) => {
            onSuccess && onSuccess(data)
        }
    })
}
export default useGetDetailTransactionExport

