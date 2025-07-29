import { ColorList } from './color';

export enum CurrentStatusList {
  PENDING = 1,
  APPROVED = 2,
  REFUSE = 3,
}

export enum LastStatusList {
  PENDING = 1,
  APPROVING = 2,
  APPROVED = 3,
  REFUSE = 4,
  CANCEL = 5,
}

export enum KitCraftStatusList {
  UN_IMPLEMENTED = 1,
  PROGRESS = 2,
  COMPLETE = 3,
  FAIL = 4,
}

export enum SimStatusList {
  NOT_USED = 1,
  WAIT_KIT_PAIRED = 2,
  KIT_PAIRED = 3,
  ACTIVAED = 4,
  PENDING = 5,
}

export enum DistributionStatusList {
  IN_STOCK = 1,
  WAIT_IN_STOCK = 2,
  BUILD = 3,
}

export enum DeliveryOrderApprovalStatusList {
  PENDING = 1,
  APPROVING = 2,
  APPROVED = 3,
  REFUSE = 4,
}
export enum DiscountList {
  PENDING = 1,
  APPROVING = 2,
  APPROVED = 3,
  REFUSE = 4,
  CANCEL = 5,
}

export enum DeliveryOrderStatusList {
  CREATE = 1,
  VOTING = 2,
  PROGRESS = 3,
  COMPLETE = 4,
  CANCEL = 5,
}

export enum NumberStatus {
  PROCESSING = 1,
  FAILURE = 2,
  SUCCESS = 3,
}

export const mappingColorNumberStatus: {
  [key: number]: (typeof ColorList)[keyof typeof ColorList];
} = {
  [NumberStatus.PROCESSING]: ColorList.WAITING,
  [NumberStatus.SUCCESS]: ColorList.SUCCESS,
  [NumberStatus.FAILURE]: ColorList.FAIL,
};
