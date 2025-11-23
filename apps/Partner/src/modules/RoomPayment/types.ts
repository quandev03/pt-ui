import { IParamsRequest } from '@vissoft-react/common';
import { ServiceType } from '../RoomService/types';

export enum PaymentStatus {
  UNPAID = 0,
  PAID = 1,
}

export interface IRoomPaymentDetail {
  id: string;
  serviceType: ServiceType;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IRoomPayment {
  id: string;
  orgUnitId: string;
  month: number;
  year: number;
  totalAmount: number;
  qrCodeUrl: string;
  status: PaymentStatus;
  paymentDate: string | null;
  details: IRoomPaymentDetail[];
  createdBy: string;
  createdDate: string;
  orgUnitName?: string;
}

export interface IRoomPaymentParams extends IParamsRequest {
  orgUnitId?: string;
  year?: number;
  month?: number;
}

export interface IRoomPaymentUploadParams {
  file: File;
  month: number;
  year: number;
}




