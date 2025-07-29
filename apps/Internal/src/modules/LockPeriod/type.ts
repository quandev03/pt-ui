export interface ILockPeriod {
  endDate: string;
  dateLock: string;
  lockBy: string;
  statusLock: number;
}
export enum STATUS_LOCKPERIOD {
  CLOSE = 1,
  OPEN = 0
}
export const getLabelStatus = (value: number): string => {
  switch (value) {
    case STATUS_LOCKPERIOD.OPEN:
      return "Đang mở";
    case STATUS_LOCKPERIOD.CLOSE:
      return "Đang khóa";
    default:
      return "Không xác định";
  }
};
export interface IPayload {
  endDate: string;
  status : number;
}
