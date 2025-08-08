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
export interface IAgencyParams {
  status?: string | number;
  textSearch?: string;
}
export interface IFormAgency {
  id?: string;
  orgCode: string;
  parentId: string;
  status: number;
  orgName: string;
}
