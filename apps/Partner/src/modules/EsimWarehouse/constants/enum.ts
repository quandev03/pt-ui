export enum ActiveStatusEnum {
  NORMAL = 1,
  ONE_WAY_CALL_BLOCK = 10,
}

export const ActiveStatusMap = {
  [ActiveStatusEnum.NORMAL]: 'success',
  [ActiveStatusEnum.ONE_WAY_CALL_BLOCK]: 'error',
};

export enum Status900Enum {
  IN_STORE = 0,
  SOLD = 1,
  CALLED = 2,
  INFO_UPDATED = 3,
}

export const SubStatusMap = {
  [Status900Enum.IN_STORE]: 'warning',
  [Status900Enum.SOLD]: 'success',
  [Status900Enum.CALLED]: 'purple',
  [Status900Enum.INFO_UPDATED]: 'blue',
};

export const GENDER_MAP: { [key: number]: string } = {
  0: 'Nam',
  1: 'Nữ',
};
