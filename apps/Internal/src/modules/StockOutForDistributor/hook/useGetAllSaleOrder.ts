import { DeliveryOrderApprovalStatusList } from '@react/constants/status';
import { useQuery } from "@tanstack/react-query"
import { prefixSaleService } from "apps/Internal/src/constants/app"
import { axiosClient } from "apps/Internal/src/service"
import { IStockOutForDistributorck, StatusStockOutForDistributor } from "../type"
const queryKey = "GET_ALL_SALE_ORDER"
const fetcher = async () => {
    const res = await axiosClient<IStockOutForDistributorck, any>(`${prefixSaleService}/sale-orders`, {
        params: {
            page: 0,
            size: 999999,
            approvalStatus: DeliveryOrderApprovalStatusList.APPROVED,
            orderStatus: StatusStockOutForDistributor.EXPORT
        }
    })
    return res
}
const useGetAllSaleOder = () => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: () => fetcher(),
        select: (data) => data,
    })
}
export default useGetAllSaleOder