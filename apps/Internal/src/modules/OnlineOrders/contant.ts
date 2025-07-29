import { ColorList } from '@react/constants/color';
import { IOrderOnlinetatus } from './types';

export const getStatusOrderOnlineColor = (code: number) => {
  switch (code) {
    case IOrderOnlinetatus.CREATED:
    case IOrderOnlinetatus.DELIVERED:
    case IOrderOnlinetatus.RETURNED_ORDER:
      return ColorList.SUCCESS;
    case IOrderOnlinetatus.WAITING:
      return ColorList.WAITING;
    case IOrderOnlinetatus.DELIVERING:
    case IOrderOnlinetatus.RETURNING_ORDER:
      return ColorList.PROCESSING;
    case IOrderOnlinetatus.DELIVERY_FAILED:
    case IOrderOnlinetatus.COMBINED_KIT_ERROR:
      return ColorList.FAIL;
    case IOrderOnlinetatus.CANCELED_ORDER:
      return ColorList.CANCEL;
    case IOrderOnlinetatus.NEW_CREATION_FAILED:
      return ColorList.CANCEL;
    default:
      return ColorList.DEFAULT;
  }
};
