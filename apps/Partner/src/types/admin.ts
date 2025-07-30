export interface IRoleItem {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  code: string;
  status: number | boolean;
  description: string;
  checkedKeys: string[];
  isPartner?: boolean;
}
