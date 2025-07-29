import { axiosClient } from "apps/Internal/src/service"
import { urlPostCheckList } from "../services/url"
import { useQuery } from "@tanstack/react-query"

const fetcher = async (historyId: string, id: string) => {
    const res = await axiosClient.get(`${urlPostCheckList}/detail-history-audit-sub?historyId=${historyId}&id=${id}`)
    return res
}
const useGetCompareHistory = (historyId: string, id: string) => {
    return useQuery({
        queryKey: [historyId, id],
        queryFn: () => fetcher(historyId, id),
        select: (data) => data,
        enabled: !!historyId && !!id
    })
}
export default useGetCompareHistory
