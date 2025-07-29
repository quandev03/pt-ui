import { IPage } from "@react/commons/types";
import { DateFormat } from "@react/constants/app";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
import dayjs from "dayjs";
import urlAirtimeBonusTransactionPartner from "../services";
import { IItemAirtimeBonusTransactionPartner, IParamAirtimeBonusTransactionPartner } from "../type";

export const queryKeyList = "airtime-bonus-transactions-partner";
const fetcher = async (params: IParamAirtimeBonusTransactionPartner) => {
    const customParams = {
        fromDate: params.fromDate ? dayjs(params.fromDate).format(DateFormat.DATE_ISO) : dayjs().subtract(29, 'day').format(DateFormat.DATE_ISO),
        toDate: params.toDate ? dayjs(params.toDate).format(DateFormat.DATE_ISO) : dayjs().endOf('day').format(DateFormat.DATE_ISO),
        page: params.page,
        size: params.size,
        approvalStatus: params.approvalStatus,
        orgName: params.orgName
    }

    const res = await axiosClient.get<IItemAirtimeBonusTransactionPartner, IPage<IItemAirtimeBonusTransactionPartner>>(`${urlAirtimeBonusTransactionPartner}`, {
        params: customParams
    })
    return res
}
const useList = (params: IParamAirtimeBonusTransactionPartner) => {
    return useQuery({
        queryKey: [queryKeyList, params],
        queryFn: () => fetcher(params),
        select: (data) => data,
    })
}
export default useList;