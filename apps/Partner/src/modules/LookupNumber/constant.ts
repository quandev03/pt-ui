import { ColorList } from "@react/constants/color";
import { size, values } from "lodash";

export const fakePhoneData = [
    {
      id: 1,
      numberPool: "Pool A",
      phoneNumber: "0912345678",
      price: "200,000 VND",
      formatCode: "VN01",
      formatName: "Vietnam Standard",
      holdTime: "30 days",
      transferStatus: "Pending",
      status: "Active",
      actions: "Edit | Delete"
    },
    {
      id: 2,
      numberPool: "Pool B",
      phoneNumber: "0987654321",
      price: "150,000 VND",
      formatCode: "VN02",
      formatName: "Vietnam VIP",
      holdTime: "60 days",
      transferStatus: "Transferred",
      status: "Inactive",
      actions: "Edit | Delete"
    },
    {
      id: 3,
      numberPool: "Pool C",
      phoneNumber: "0909876543",
      price: "180,000 VND",
      formatCode: "VN03",
      formatName: "Vietnam Business",
      holdTime: "45 days",
      transferStatus: "Pending",
      status: "Active",
      actions: "Edit | Delete"
    },
    {
      id: 4,
      numberPool: "Pool D",
      phoneNumber: "0934567890",
      price: "220,000 VND",
      formatCode: "VN04",
      formatName: "Vietnam Gold",
      holdTime: "90 days",
      transferStatus: "idt Transferred",
      status: "Active",
      actions: "Edit | Delete"
    },
    {
      id: 5,
      numberPool: "Pool E",
      phoneNumber: "0943216789",
      price: "250,000 VND",
      formatCode: "VN05",
      formatName: "Vietnam Premium",
      holdTime: "120 days",
      transferStatus: "Transferred",
      status: "Inactive",
      actions: "Edit | Delete"
    }
];

export const LABLE_STATUS = {
  A: 'Chờ ghép KIT',
  B: 'Đã ghép KIT',
  C: 'Chưa sử dụng',
  D: 'Đã kích hoạt',
  E: 'Ngưng sử dụng',
  F: 'Trong kho',
  G: 'Chờ phê duyệt'

}

export const statusOptions = [
  { value: 2, label: LABLE_STATUS.A },
  { value: 3, label: LABLE_STATUS.B },
  { value: 1, label: LABLE_STATUS.C },
  { value: 4, label: LABLE_STATUS.D },
  { value: 5, label: LABLE_STATUS.E },
];
export const transferStatus = [
  { value: 1, label: LABLE_STATUS.F },
  { value: 2, label: LABLE_STATUS.G }
]

export const IMPACT_ON_NUMBER = {
  A: 'Giữ số',
  B: 'Bỏ giữ số',
  C: 'Phân phối',
  D: 'Điều chuyển',
  E: 'Thu hồi',
  F: 'Ghép KIT',
  H: 'Kích hoạt',
  G: 'Upload vào kho'
}
export const DEFAULT_PARAMS = {
  page: 0,
  size: 10
}
export const ACTION_KEEP_ISDN = {
  KEEP: 'keep',
  UN_KEEP: 'unkeep'
}
export const PARAM_STATUS = {
  "table-name": "STOCK_ISDN",
  "column-name": "STATUS"
}

export const PARAM_TRANSFER_STATUS = {
  "table-name": "STOCK_ISDN",
  "column-name": "TRANSFER_STATUS"
}
export const QUERY_KEY = {
  GET_SEARCH_NUMBER: 'GET_SEARCH_NUMBER',
  GET_HISTORY_ISDN: 'GET_HISTORY_ISDN',
  GET_KEEP_ISDN:'GET_KEEP_ISDN',
  GET_UN_KEEP_ISDN: 'GET_UN_KEEP_ISDN',
  GET_STOCK_ISDN:'GET_STOCK_ISDN',
  GET_STATUS: 'GET_STATUS',
  GET_TRANSFER_STATUS: 'GET_TRANSFER_STATUS'
}
export const TRANS_TYPE = {
  A:'Upload vào kho',
  B: 'Điều chuyển',
  C: 'Thu hồi',
  D: 'Ghép KIT',
  E: 'Phân phối',
  F: 'Kích hoạt',
  G: 'Giữ số'
}

export const getNameTransType = (value: number) => {
  switch(value) {
    case 1:
     return TRANS_TYPE.A
    case 2:
      return TRANS_TYPE.B
    case 3:
     return TRANS_TYPE.C
    case 4:
     return TRANS_TYPE.D
    case 5:
     return TRANS_TYPE.E
    case 6:
     return TRANS_TYPE.F
    case 7:
     return TRANS_TYPE.G
    default:
      return null
  }
}
export const VALIDATE_DATE_MESSAGE = {
  START_DATE_IN_FUTURE: 'Từ ngày không được lớn hơn ngày hiện tại',
  END_DATE_IN_FUTURE: 'Đến ngày không được lớn hơn ngày hiện tại',
  DATE_RANGE_EXCEEDS_LIMIT: 'Thời gian tìm kiếm không được vượt quá 30 ngày',
  END_DATE_BEFORE_START_DATE: 'Đến ngày không được nhỏ hơn Từ ngày'
};
export enum STOCK_ISDN_STATUS_ENUM {
  DEFAULT = 1,
  WAITING = 2,
  SUCCESS = 3,
  OKE = 4,
  FAIL = 5,
}

export const STOCK_ISDN_STATUS_COLOR = {
  [STOCK_ISDN_STATUS_ENUM.DEFAULT]: ColorList.DEFAULT,
  [STOCK_ISDN_STATUS_ENUM.WAITING]: ColorList.WAITING,
  [STOCK_ISDN_STATUS_ENUM.SUCCESS]: ColorList.SUCCESS,
  [STOCK_ISDN_STATUS_ENUM.OKE]: ColorList.SUCCESS,
  [STOCK_ISDN_STATUS_ENUM.FAIL]: ColorList.FAIL,
};

export enum TRANSFER_STATUS_ENUM {
  PROCESSING = 1,
  WAITING = 2,
}
