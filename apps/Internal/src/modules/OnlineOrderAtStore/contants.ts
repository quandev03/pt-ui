import { ColorList } from '@react/constants/color';
import { IOrderOnlinePaymentStatus, IOrderOnlineStatus } from './types';

export const getStatusOrderOnlineColor = (code: number) => {
  switch (code) {
    case IOrderOnlineStatus.CREATED:
    case IOrderOnlineStatus.DELIVERED:
    case IOrderOnlineStatus.RETURNED_ORDER:
      return ColorList.SUCCESS;
    case IOrderOnlineStatus.WAITING:
      return ColorList.WAITING;
    case IOrderOnlineStatus.DELIVERING:
    case IOrderOnlineStatus.RETURNING_ORDER:
      return ColorList.PROCESSING;
    case IOrderOnlineStatus.DELIVERY_FAILED:
    case IOrderOnlineStatus.COMBINED_KIT_ERROR:
      return ColorList.FAIL;
    case IOrderOnlineStatus.CANCELED_ORDER:
      return ColorList.CANCEL;

    default:
      return ColorList.DEFAULT;
  }
};

export const getPaymentStatusOrderOnlineColor = (code: number) => {
  switch (code) {
    case IOrderOnlinePaymentStatus.NOT_PAID:
      return ColorList.WAITING;
    case IOrderOnlinePaymentStatus.PAID:
      return ColorList.SUCCESS;
    case IOrderOnlinePaymentStatus.PAYING:
      return ColorList.PROCESSING;
    default:
      return ColorList.DEFAULT;
  }
};
