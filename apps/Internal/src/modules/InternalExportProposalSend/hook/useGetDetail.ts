import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { urlDeliveryOrder } from './../services/url';
import { IDataDetailInternalExportProposal } from '../type';
import { ActionType } from '@react/constants/app';
const queryKey = 'GET_DETAIL_INTERNAL_EXPORT_PROPOSAL'
const fetcher = async (id: string) => {
    const res = await axiosClient.get<IDataDetailInternalExportProposal, any>(`${urlDeliveryOrder}/${id}`)
    return res
}
const useGetDetail = (id: string) => {
    return useQuery({
        queryKey: [queryKey,id],
        queryFn: () => fetcher(id),
        enabled: !!id
    })
}
export default useGetDetail

