import { ParamsOption } from "@react/commons/types";
import useGetDataFromQueryKey from "@react/hooks/useGetDataFromQueryKey";
import { REACT_QUERY_KEYS } from "../../constants/querykeys";

export interface IParamsManagePartnerAirtimeAccount {
    page: number;
    pageSize: number;
    orgName?:string;
    fromDate?:string;
    toDate?:string;
}
export interface IItemPartnerAirtimeAccount {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    orgName: string;
    orgSubType: string;
    amount: number;
}
export const getListOrgSubType =  () => {
    const { PARTNER_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
    return PARTNER_TYPE
}