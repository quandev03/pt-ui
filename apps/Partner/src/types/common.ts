export type ParamKeys = 'EXAMPLE' | 'EXAMPLE2';
export interface IAgency {
  address: string | null;
  createdBy: string;
  createdDate: string;
  districtCode: string | null;
  email: string | null;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  note: string | null;
  orgCode: string;
  orgName: string;
  parentId: string;
  provinceCode: string | null;
  status: number;
  wardCode: string | null;
}
