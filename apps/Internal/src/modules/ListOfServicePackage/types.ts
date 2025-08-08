import { StatusEnum } from '@vissoft-react/common';

export interface IListOfServicePackage {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: string;
  pckCode: string;
  pckName: string;
  packagePrice: number;
  status: number;
  description: string;
}
export interface IListOfServicePackageForm {
  pckCode: string;
  pckName: string;
  packagePrice: number;
  status: boolean | StatusEnum;
  images: File | null;
}
