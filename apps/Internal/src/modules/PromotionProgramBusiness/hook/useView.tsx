import { ActionType } from '@react/constants/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import urlPromotionProgramBusiness from '../services/url';
import { IDetailPromotionProgram } from '../types';
export const queryKeyList = "GET_LIST_PROMOTION_PROGRAM_BUSINESS_VIEW";
const fetcher = async (id: string) => {
    const res = await axiosClient.get<IDetailPromotionProgram, IDetailPromotionProgram>(`${urlPromotionProgramBusiness}/${id}`)
    return res
}
const useView = (id: string, typeModal: ActionType) => {
    return useQuery({
        queryKey: [queryKeyList, id, typeModal],
        queryFn: () => fetcher(id),
        select: (data) => data,
        enabled: !!id
    })
}
export default useView;
