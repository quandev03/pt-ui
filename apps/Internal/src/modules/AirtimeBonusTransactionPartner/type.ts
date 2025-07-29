import { ParamsOption } from "@react/commons/types";
import useGetDataFromQueryKey from "@react/hooks/useGetDataFromQueryKey";
import { REACT_QUERY_KEYS } from "../../constants/querykeys";
import { ColorList } from "@react/constants/color";
import { File } from "buffer";

export interface IParamAirtimeBonusTransactionPartner {
  page: number;
  size: number;
  orgName?: string;
  approvalStatus?: string;
  fromDate?: string;
  toDate?: string;
}
export interface IItemAirtimeBonusTransactionPartner {
  createdBy: string;
  createdDate: string;
  modifiedBy: null;
  modifiedDate: null;
  id: number;
  orgName: string;
  orgSubType: string;
  amount: number;
  approvalStatus: number;
  transDate: string;
  description: string;
  attachments: null;
}
export const mappingColor = {
  '1': ColorList.WAITING,
  '2': ColorList.PROCESSING,
  '3': ColorList.SUCCESS,
  '4': ColorList.FAIL,
  '5': ColorList.FAIL
};
export interface IValueForm {
  orgId: number | string,
  amount: number | string,
  description?: string,
  files?: File[],
}
export interface IPayload{
  request: {
    orgId: string | number,
    amount: string | number,
    description?: string,
    attachmentDescriptions?: string[]  
  }
  attachmentFiles?:any;
}
export interface IParamsOrgPartner {
  page: number;
  size: number;
  approvalStatus:number;
  status:number;
  q?:string;
}
export interface IDataDetaiOrgPartner{
  address: string | null,
  approvalStatus: number,
  businessLicenseAddress: string | null,
  businessLicenseFileLink: string | null,
  businessLicenseFileUrl: string | null,
  businessLicenseNo: string | null,
  clientId: string,
  contractDate: string,
  contractNo: string | null,
  contractNoFileLink: string | null,
  contractNoFileUrl: string | null,
  createdBy: string,
  createdDate: string,
  deliveryAreas: null,
  deliveryInfos: null,
  districtCode: string | null,
  email: string,
  id: number,
  modifiedBy: string,
  modifiedDate: string,
  orgBankAccountNo: string | null,
  orgCode: string,
  orgDescription: string | null,
  orgName: string,
  orgPartnerType: string,
  orgSubType: string,
  orgType: string,
  parentId: string | null,
  phone: string,
  provinceCode: string | null,
  representative: string | null,
  saleChanel: null,
  status: number,
  taxCode: string,
  wardCode: string | null
}

export const GetListOrgSubType =  () => {
  const { PARTNER_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  return PARTNER_TYPE
}
export const GetListStatusApproval =  () => {
  const { AIRTIME_TRANSACTION_APPROVAL_STATUS = [] } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  return AIRTIME_TRANSACTION_APPROVAL_STATUS
}