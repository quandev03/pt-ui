import { IParamsRequest } from '@vissoft-react/common';

export enum AdvertisementStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export interface IAdvertisement {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: AdvertisementStatus;
  clientId: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
}

export interface IAdvertisementParams extends IParamsRequest {
  status?: AdvertisementStatus;
}

export interface IFormAdvertisement {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  status: AdvertisementStatus;
  image?: File | File[] | null;
}

export interface IAdvertisementCreateRequest {
  title: string;
  content: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  status: AdvertisementStatus;
}

