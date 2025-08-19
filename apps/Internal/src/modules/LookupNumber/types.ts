export type IParameter = {
  page: number;
  size: number;
  q?: string;
  status?: number;
  orgCode?: string;
};
export type IResLookupNumber = {
  activeStatus: number;
  boughtStatus: number;
  id: string;
  imsi: number;
  isdn: number;
  orgCode: string;
  orgName: string;
  serial: string;
  status: number;
  statusCall900: number;
  verifiedStatus: number;
};
