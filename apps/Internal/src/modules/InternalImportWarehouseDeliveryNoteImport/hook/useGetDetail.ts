import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { urlInternalWarehouseDeliveryNote } from './../services/url';
const queryKey = 'GET_DETAIL_INTERNAL_WAREHOUSE_DELIVERY_NOTE'
const fetcher = async (id: string) => {
    const res = await axiosClient.get<any, any>(`${urlInternalWarehouseDeliveryNote}/${id}`)
    return res
}
const useGetDetail = (id: string) => {
    return useQuery({
        queryKey: [queryKey, id],
        queryFn: () => fetcher(id),
        enabled: !!id
    })
}
export default useGetDetail

