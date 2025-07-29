import { ColorList } from '@react/constants/color';
import { IOrderCSStatus, IOrderCSPaymentStatus } from './types';

export const getStatusOrderCSColor = (code: number) => {
  switch (code) {
    case IOrderCSStatus.CREATED:
    case IOrderCSStatus.DELIVERED:
    case IOrderCSStatus.RETURNED_ORDER:
      return ColorList.SUCCESS;
    case IOrderCSStatus.WAITING:
      return ColorList.WAITING;
    case IOrderCSStatus.DELIVERING:
    case IOrderCSStatus.RETURNING_ORDER:
      return ColorList.PROCESSING;
    case IOrderCSStatus.DELIVERY_FAILED:
    case IOrderCSStatus.COMBINED_KIT_ERROR:
      return ColorList.FAIL;
    case IOrderCSStatus.CANCELED_ORDER:
      return ColorList.CANCEL;

    default:
      return ColorList.DEFAULT;
  }
};

export const getPaymentStatusOrderCSColor = (code: number) => {
  switch (code) {
    case IOrderCSPaymentStatus.NOT_PAID:
      return ColorList.WAITING;
    case IOrderCSPaymentStatus.PAID:
      return ColorList.SUCCESS;
    case IOrderCSPaymentStatus.PAYING:
      return ColorList.PROCESSING;
    default:
      return ColorList.DEFAULT;
  }
};

export enum IOrderCSKitStatus {
  ACTIVE = "Đã kích hoạt",
  INACTIVE = "Chưa kích hoạt",
}

export const getKitStatusOrderCSColor = (code: IOrderCSKitStatus) => {
  switch (code) {
    case IOrderCSKitStatus.ACTIVE:
      return ColorList.SUCCESS;
    case IOrderCSKitStatus.INACTIVE:
      return ColorList.DEFAULT;
    default:
      return ColorList.DEFAULT;
  }
};