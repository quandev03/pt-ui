import { axiosClient } from "apps/Internal/src/service"
import { urlUploadNumber } from "../services/url"
import { useQuery } from "@tanstack/react-query"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';

const fetcher = async (id: string) => {
    const res = await axiosClient.get<string, INumberTransactionDetail>(`${urlUploadNumber}/${id}`)
    return res
}
const useGetDetailUploadNumber = (id: string) => {
    return useQuery({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_UPLOAD_NUMBER, id],
        queryFn: () => fetcher(id),
        enabled: !!id
    })
}
export default useGetDetailUploadNumber
