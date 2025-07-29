import { axiosClient } from "apps/Internal/src/service";
import { urlStockOutForDistributor } from "../services/url";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys";
import { IParamStockOutForDistributor, IStockOutForDistributorck } from "../type";
import { AnyElement } from "@react/commons/types";
import { DeliveryOrderType } from "@react/constants/app";
import dayjs from "dayjs";

const fetcher = async (params: IParamStockOutForDistributor) => {
    const customParams = {
        ...params,
        deliveryNoteType: DeliveryOrderType.PARTNER,
        deliveryNoteMethod: DeliveryOrderType.INTERNAL,
        fromDate: params.fromDate ? dayjs(params.fromDate).startOf('day').toISOString() : dayjs().subtract(29, 'day').startOf('day').toISOString(),
        toDate: params.toDate ? dayjs(params.toDate).endOf('day').toISOString() : dayjs().endOf('day').toISOString()
    }
    const res = await axiosClient.get<IStockOutForDistributorck, AnyElement>(`${urlStockOutForDistributor}`, { params: customParams });
    return res
}

const useGetListStockOutForDistributor = (params: IParamStockOutForDistributor) => {
    return useQuery({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_STOCK_OUT_FOR_DISTRIBUTOR, params],
        queryFn: () => fetcher(params),
        select: (data) => data
    })
}
export default useGetListStockOutForDistributor