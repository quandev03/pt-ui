import { AnyElement } from "@react/commons/types";

export interface IPraramsPromotionProgramBusiness {
  q?: string;
  page: number;
  size: number;
  status?: number;
  fromDate: string;
  toDate: string;
  dateType: string;
  programService?: string;
  promotionType?: string;
}
export interface ISaleChannels {
  channelCode: string;
  channelName: string;
  status: boolean;
}
export interface IItemPromotionProgram {
  id: number;
  promCode: string;
  promName: string;
  promCodeMethod: number;
  quantity: number;
  startDate: string;
  endDate: string;
  status: number;
}
export enum PromCodeMethods {
  ONE_CODE = 1,
  MANY_CODE = 2,
}
export interface IPayload {
  id?: string;
  promCode: string;
  promName: string;
  promCodeMethod: number;
  quantity: number; // Số lượng mã
  prefixCode: string | null; // Tiền tố
  suffixCode: string | null; // Hậu tố
  fromNumber: number | null; // Số random từ
  toNumber: number | null; // Số random đến
  startDate: string; // Ngày bắt đầu
  endDate: string; // Ngày kết thúc
  status: number; // Trạng thái
  channel: string | string[]; // Kênh áp dụng
  programService: string; // Dịch vụ áp dụng
  promMethod: number; // Loại khuyến mại
  promValue: number; // Giá trị khuyến mại
  userLimit: number; // Số lần sử dụng
  minPrice: number; // Giá trị tối thiểu
  promotionProgramLines: {
    promotionProduct: number;
    promotionType: number;
    promotionValuePromotionProgramLine: number | null;
  }[];
  promotionPackage: AnyElement;
  simType: string;
}
export interface IDetailPromotionProgram {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  promCode: string;
  promName: string;
  promCodeMethod: number;
  quantity: number;
  prefixCode: string;
  suffixCode: string;
  fromNumber: number;
  toNumber: number;
  startDate: string;
  endDate: string;
  status: number;
  channel: string;
  programService: string;
  promMethod: string;
  promValue: number;
  userLimit: number;
  minPrice: number;
  promotionPackage: string;
  promotionType: string;
  promotionProgramLines: {
    promotionProduct: number;
    promotionType: number;
    promotionValue: number;
  }[];
}
export enum PromotionProductType {
  PRICE = '2',
  PERCENT = '1',
}
export enum PromotionProductTypeString {
  PRICE = 'PRICE',
  PERCENT = 'PERCENT',
}
export enum PromotionProgramService {
  GIA_HAN_GOI = 'RENEW_PACKAGE',
  BAN_BO_HOA_MANG = 'BUY_TELE_KIT',
  BAN_GOI_MOI = 'BUY_PACKAGE',
  BAN_SIM_OUTBOUND = 'SIM_OUTBOUND',
}
export enum PromotionProgramPromMethod {
  TONG_TIEN_DON_HANG = '1',
  SAN_PHAM = '2',
}
export enum PromotionProgramPromotionProduct {
  TIEN_SIM = '1',
  GOI_CUOC = '2',
  PHI_CHON_SO = '3',
  PHI_HOA_MANG = '4',
}