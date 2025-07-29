import { useQuery } from '@tanstack/react-query';
import { urlInternalWarehouseDeliveryNote } from './../services/url';
import { axiosClient } from 'apps/Internal/src/service';
import { DeliveryOrderType } from '@react/constants/app';
import dayjs from 'dayjs';
export const queryKeyList = "GET_LIST_INTERNAL_WAREHOUSE_DELIVERY_NOTE"
const fetcher = async (params: any) => {
    const customParams = {
        ...params,
        deliveryNoteType: DeliveryOrderType.INTERNAL,
        fromDate: params.fromDate ? dayjs(params.fromDate).startOf('day').toISOString() : dayjs().subtract(29, 'day').startOf('day').toISOString(),
        toDate: params.toDate ? dayjs(params.toDate).endOf('day').toISOString() : dayjs().endOf('day').toISOString()
    }
    const res = await axiosClient.get<any, any>(`${urlInternalWarehouseDeliveryNote}`, { params: customParams })
    return res
}
const useList = (params: any) => {
    return useQuery({
        queryKey: [queryKeyList, params],
        queryFn: () => fetcher(params),
        select: (data) => data
    })
}
export default useList
