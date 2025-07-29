import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from "apps/Internal/src/constants/app"
import { axiosClient } from "apps/Internal/src/service"
import { IStockOutForDistributorck } from "../type"
import { DeliveryOrderApprovalStatusList, DeliveryOrderStatusList } from '@react/constants/status';

const fetcher = async (params: any) => {
  const res = await axiosClient.get<IStockOutForDistributorck, any>(`${prefixSaleService}/sale-orders/search-order-remain-quantity`, { params })
  return res
}
const useGetSaleOder = () => {
  return useMutation({
    mutationFn: (keySearch: string) =>
      fetcher({
        q: keySearch,
        page: 0,
        size: 20,
        approvalStatus: DeliveryOrderApprovalStatusList.APPROVED,
        orderStatus: DeliveryOrderStatusList.VOTING
      }).then((res) => res?.content?.map((item: IStockOutForDistributorck) => {
        return {
          value: item.id,
          label: item.orderNo
        }
      }) ?? [])
  });
}
export default useGetSaleOder
