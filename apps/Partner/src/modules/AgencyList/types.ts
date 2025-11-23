import { RoomRentalStatus } from './constants/enum';

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
  imageUrls?: string[]; // Danh sách URL ảnh
  rentalStatus?: RoomRentalStatus | string; // Trạng thái phòng
}
export interface IAgencyParams {
  status?: string | number;
  textSearch?: string;
  rentalStatus?: RoomRentalStatus | string;
}
export interface IFormAgency {
  id?: string;
  orgCode: string;
  parentId?: string; // Optional vì đã bỏ field này
  status: number;
  orgName: string;
  images?: File[]; // Danh sách ảnh
  rentalStatus?: RoomRentalStatus | string; // Trạng thái phòng
}
