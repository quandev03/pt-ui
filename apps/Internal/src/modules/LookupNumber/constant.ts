import { ColorList } from '@vissoft-react/common';

export enum TRANSFER_STATUS_ENUM {
  PROCESSING = 1,
  WAITING = 2,
}
export enum STOCK_ISDN_STATUS_ENUM {
  DEFAULT = 1,
  WAITING = 2,
  SUCCESS = 3,
  OKE = 4,
  FAIL = 5,
}

export const STOCK_ISDN_TRANSFER_STATUS_COLOR = {
  [TRANSFER_STATUS_ENUM.PROCESSING]: ColorList.PROCESSING,
  [TRANSFER_STATUS_ENUM.WAITING]: ColorList.WAITING,
};
export const STOCK_ISDN_STATUS_COLOR = {
  [STOCK_ISDN_STATUS_ENUM.DEFAULT]: ColorList.DEFAULT,
  [STOCK_ISDN_STATUS_ENUM.WAITING]: ColorList.WAITING,
  [STOCK_ISDN_STATUS_ENUM.SUCCESS]: ColorList.SUCCESS,
  [STOCK_ISDN_STATUS_ENUM.OKE]: ColorList.SUCCESS,
  [STOCK_ISDN_STATUS_ENUM.FAIL]: ColorList.FAIL,
};

export const LABLE_STATUS = {
  A: 'Chờ ghép KIT',
  B: 'Đã ghép KIT',
  C: 'Chưa sử dụng',
  D: 'Đã kích hoạt',
  E: 'Ngưng sử dụng',
  F: 'Trong kho',
  G: 'Chờ phê duyệt',
};

export const statusOptions = [
  { value: 2, label: LABLE_STATUS.A },
  { value: 3, label: LABLE_STATUS.B },
  { value: 1, label: LABLE_STATUS.C },
  { value: 4, label: LABLE_STATUS.D },
  { value: 5, label: LABLE_STATUS.E },
];
export const transferStatus = [
  { value: 1, label: LABLE_STATUS.F },
  { value: 2, label: LABLE_STATUS.G },
];

export const IMPACT_ON_NUMBER = {
  A: 'Giữ số',
  B: 'Bỏ giữ số',
  C: 'Phân phối',
  D: 'Điều chuyển',
  E: 'Thu hồi',
  F: 'Ghép KIT',
  H: 'Kích hoạt',
  G: 'Upload vào kho',
};
export const DEFAULT_PARAMS = {
  page: 0,
  size: 10,
};
export const ACTION_KEEP_ISDN = {
  KEEP: 'keep',
  UN_KEEP: 'unkeep',
};

export const TRANS_TYPE = {
  A: 'Upload vào kho',
  B: 'Điều chuyển',
  C: 'Thu hồi',
  D: 'Ghép KIT',
  E: 'Phân phối',
  F: 'Kích hoạt',
  G: 'Giữ số',
};

export const getNameTransType = (value: number) => {
  switch (value) {
    case 1:
      return TRANS_TYPE.A;
    case 2:
      return TRANS_TYPE.B;
    case 3:
      return TRANS_TYPE.C;
    case 4:
      return TRANS_TYPE.D;
    case 5:
      return TRANS_TYPE.E;
    case 6:
      return TRANS_TYPE.F;
    case 7:
      return TRANS_TYPE.G;
    default:
      return null;
  }
};
export const VALIDATE_DATE_MESSAGE = {
  START_DATE_IN_FUTURE: 'Từ ngày không được lớn hơn ngày hiện tại',
  END_DATE_IN_FUTURE: 'Đến ngày không được lớn hơn ngày hiện tại',
  DATE_RANGE_EXCEEDS_LIMIT: 'Thời gian tìm kiếm không được vượt quá 30 ngày',
  END_DATE_BEFORE_START_DATE: 'Đến ngày không được nhỏ hơn Từ ngày',
};
