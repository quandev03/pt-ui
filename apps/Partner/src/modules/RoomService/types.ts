import { IParamsRequest } from '@vissoft-react/common';

export enum ServiceType {
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
  INTERNET = 'INTERNET',
  ROOM_RENT = 'ROOM_RENT',
  OTHER = 'OTHER',
}

export interface IRoomService {
  id: string;
  orgUnitId: string;
  orgUnitName?: string;
  serviceType: ServiceType;
  serviceCode?: string;
  serviceName?: string;
  price: number;
  status: number;
  clientId?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface IRoomServiceParams extends IParamsRequest {
  serviceType?: ServiceType;
  status?: number;
  textSearch?: string;
}

export interface IRoomServiceForm {
  orgUnitId: string;
  serviceType: ServiceType;
  serviceCode?: string;
  serviceName?: string;
  price: number;
  status: number;
}

