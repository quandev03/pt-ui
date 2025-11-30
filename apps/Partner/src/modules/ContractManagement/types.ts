import { IParamsRequest } from '@vissoft-react/common';

export interface IOCRData {
  address: string;
  addressconf: string;
  birthday: string;
  characteristics: string;
  charactoristics_conf: string | null;
  copyright: string;
  country: string;
  district: string;
  document: string;
  ethnicity: string;
  ethnicityconf: string;
  expiry: string;
  expiryconf: string;
  hometown: string;
  homtownconf: string | null;
  id: string;
  id_check: string;
  id_full: string;
  idconf: string;
  issue_by: string;
  issue_date: string;
  issue_date_conf: string;
  name: string;
  nameconf: string;
  national: string;
  precinct: string;
  province: string;
  religion: string;
  religionconf: string;
  request_id: string;
  result_code: string;
  server_name: string;
  server_ve: string | null;
  sex: string;
  sexconf: string;
  street: string;
  street_name: string;
}

export interface IOCRResponse {
  data_ocr: {
    ocr_front: IOCRData;
    ocr_back: IOCRData;
  };
  errCode: string;
  id_ekyc: string;
  message: string;
}

export interface IContract {
  id: string;
  backImageUrl?: string;
  contractLocation?: string;
  contractPdfUrl?: string;
  createdBy?: string;
  createdDate?: string;
  currentDay?: string;
  currentMonth?: string;
  currentYear?: string;
  depositAmount?: string | null;
  electricPrice?: string;
  endDateDay?: string;
  endDateMonth?: string;
  endYear?: string;
  frontImageUrl?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  noticeDays?: string;
  ownerBirth?: string | null;
  ownerId?: string | null;
  ownerIdIssueDay?: string | null;
  ownerIdIssueMonth?: string | null;
  ownerIdIssuePlace?: string | null;
  ownerIdIssueYear?: string | null;
  ownerName?: string | null;
  ownerPermanentAddress?: string | null;
  ownerPhone?: string | null;
  paymentMethod?: string;
  portraitImageUrl?: string;
  rentPrice?: string;
  roomAddress?: string | null;
  startDateDay?: string;
  startDateMonth?: string;
  startYear?: string;
  tenantBirth?: string;
  tenantId?: string;
  tenantIdIssueDay?: string;
  tenantIdIssueMonth?: string;
  tenantIdIssuePlace?: string;
  tenantIdIssueYear?: string;
  tenantName?: string;
  tenantPermanentAddress?: string;
  tenantPhone?: string | null;
  waterPrice?: string;
  // Legacy fields for backward compatibility
  name?: string;
  address?: string;
  phone?: string;
  startDate?: string;
  endDate?: string;
  roomId?: string;
  roomName?: string;
  ocrData?: IOCRResponse;
  contractFileUrl?: string;
  contractFileName?: string;
  idEkyc?: string;
}

export interface IContractParams extends IParamsRequest {
  page?: number;
  size?: number;
  ownerName?: string;
  tenantName?: string;
  fromDate?: string; // Format: 2025-11-01T00:00:00
  toDate?: string; // Format: 2025-11-30T23:59:59
  sort?: string; // Format: createdDate,desc
  roomId?: string;
  textSearch?: string;
  startDate?: string;
  endDate?: string;
}

export interface IOCRParams {
  front: File;
  back: File;
  portrait: File;
  typeCard?: number;
}

export interface IGenContractParams {
  organizationUnitId: string;
  contractData: IContractData;
  frontImage: File;
  backImage: File;
  portraitImage: File;
}

export interface IContractForm {
  name: string;
  address: string;
  phone: string;
  startDate: string;
  endDate: string;
  roomId: string;
  ocrData: IOCRResponse;
  idEkyc: string;
  contractFile?: File;
  contractFileUrl?: string;
}

export interface IContractData {
  contractLocation: string;
  currentDay: string;
  currentMonth: string;
  currentYear: string;
  ownerName: string;
  ownerBirth: string;
  ownerPermanentAddress: string;
  ownerId: string;
  ownerIdIssueDay: string;
  ownerIdIssueMonth: string;
  ownerIdIssueYear: string;
  ownerIdIssuePlace: string;
  ownerPhone: string;
  tenantName: string;
  tenantBirth: string;
  tenantPermanentAddress: string;
  tenantId: string;
  tenantIdIssueDay: string;
  tenantIdIssueMonth: string;
  tenantIdIssueYear: string;
  tenantIdIssuePlace: string;
  tenantPhone: string;
  roomAddress: string;
  rentPrice: string;
  paymentMethod: string;
  electricPrice: string;
  waterPrice: string;
  depositAmount: string;
  startDateDay: string;
  startDateMonth: string;
  startYear: string;
  endDateDay: string;
  endDateMonth: string;
  endYear: string;
  noticeDays: string;
}

export interface ISaveContractParams {
  organizationUnitId: string;
  contractData: IContractData;
  frontImage: File;
  backImage: File;
  portraitImage: File;
}

