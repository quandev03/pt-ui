import { axiosClient } from "apps/Internal/src/service"
import { urlUploadNumber } from "../services/url"
import { useQuery } from "@tanstack/react-query"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"
import { IParamsRequestUploadDigitalResources } from "../types"
import dayjs from "dayjs"
import { formatDate } from "@react/constants/moment"

const fetcher = async (params: IParamsRequestUploadDigitalResources) => {
    delete params.status
    const from = params.from ? dayjs(params.from, formatDate).startOf('day').format("YYYY-MM-DDTHH:mm:ss") : dayjs().subtract(29, 'day').startOf('day').format("YYYY-MM-DDTHH:mm:ss");
    const to = params.to ? dayjs(params.to, formatDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss") : dayjs().endOf('day').format("YYYY-MM-DDTHH:mm:ss");
    const customParams = {
        ...params,
        from,
        to
    }
    const res = await axiosClient.get<any, any>(`${urlUploadNumber}`, { params: customParams })
    return res
}

const useGetListUploadNumber = (params: IParamsRequestUploadDigitalResources) => {
    return useQuery({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_NUMBER, params],
        queryFn: () => fetcher(params)
    })
}

export default useGetListUploadNumber
