import dayjs from 'dayjs';
import { VALIDATE_DATE_MESSAGE } from '../constant';

export const validateDateRange = (
  startDate: any,
  endDate: any,
  messageForFutureDate: string,
  messageForRange: string
) => {
  // const today = dayjs();
  // if (startDate && startDate.isAfter(today)) {
  //   return Promise.reject(new Error(messageForFutureDate));
  // }
  // if (endDate && endDate.isAfter(today)) {
  //   return Promise.reject(new Error(messageForFutureDate));
  // }
  // if (startDate && endDate && endDate.isBefore(startDate)) {
  //   return Promise.reject(new Error(VALIDATE_DATE_MESSAGE.END_DATE_BEFORE_START_DATE));
  // }
  if (startDate && endDate && endDate.diff(startDate, 'months', true) > 1) {
    return Promise.reject(new Error(messageForRange));
  }

  return Promise.resolve();
};
