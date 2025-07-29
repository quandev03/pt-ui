import { useQuery } from '@tanstack/react-query';
import { IDataListInternalExportProposal, IParamsInternalExportProposal } from '../type';
import { urlDeliveryOrder } from './../services/url';
import { axiosClient } from 'apps/Internal/src/service';
import { DeliveryOrderType } from '@react/constants/app';
import dayjs from 'dayjs';
export const queryKeyList = "GET_LIST_INTERNAL_EXPORT_PROPOSAL"
const fetcher = async (data: IParamsInternalExportProposal) => {
    const body = {
        q: data.q,
        orderStatus: Number(data.orderStatus),
        approvalStatus: Number(data.approvalStatus),
        deliveryOrderType: DeliveryOrderType.INTERNAL,
        fromDate: data.fromDate ? dayjs(data.fromDate).startOf('day').toISOString() : dayjs().subtract(29, 'day').startOf('day').toISOString(),
        toDate: data.toDate ? dayjs(data.toDate).endOf('day').toISOString() : dayjs().endOf('day').toISOString()
    }
    const res = await axiosClient.post<IDataListInternalExportProposal, any>(`${urlDeliveryOrder}/search?page=${data.page}&size=${data.size}`, {
        q: body.q,
        orderStatusList: body.orderStatus ? [body.orderStatus] : [],
        approvalStatus: body.approvalStatus,
        deliveryOrderType: body.deliveryOrderType,
        fromDate: body.fromDate,
        toDate: body.toDate
    })
    return res
}
const useList = (data: IParamsInternalExportProposal) => {
    return useQuery({
        queryKey: [queryKeyList, data],
        queryFn: () => fetcher(data),
        select: (data) => data
    })
}
export default useList
