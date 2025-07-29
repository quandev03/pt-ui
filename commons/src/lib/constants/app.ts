export enum TypeSyncing {
  NOT_SYNC = 0,
  SYNCING = 1,
  SYNC_SUCCESS = 2,
  SYNC_FAIL = 3,
  SYNC_TIMEOUT = 4,
  NO_DATA = -1,
}

//dùng để check quyền các button
export enum ActionsTypeEnum {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  COPY = 'COPY',
  APPROVED = 'APPROVE',
  FINISH = 'FINISH',
  REJECT = 'REJECT',
  READ_DETAIL = 'READ_DETAIL',
  CANCEL = 'CANCEL',
  AUTHORIZATION = 'AUTHORIZATION', // phân quyền ở màn gói cước
  EDITKEY = 'EDITKEY', //sửa trường key màn kích hoạt thuê bao
  PARTNER_USER_MANAGER = 'PARTNER_USER_MANAGER', // Quản lý user đối tác danh mục đối tác
  PHONE_NO_STOCK_AUTHORIZATION = 'PHONE_NO_STOCK_AUTHORIZATION', // Phân quyền kho số màn danh mục đối tác
  PRODUCT_AUTHORIZATION = 'PRODUCT_AUTHORIZATION', // Phân quyền sản phẩm danh mục đối tác
  VIEW_APPROVAL_PROCESS = 'VIEW_APPROVAL_PROCESS', // Phân quyền sản phẩm danh mục đối tác
  ACTIVATE_SUBSCRIBER = 'ACTIVATE_SUBSCRIBER', //kích hoạt thuê bao
  ACTIVATE_SUBSCRIBER_MASH = 'ACTIVATE_SUBSCRIBER_MASH', //kích hoạt thuê bao >3
  ASSIGN = 'ASSIGN',
  CONFIRM = 'CONFIRM',
  MODIFY = 'MODIFY',
  REQUEST_UPDATE = 'REQUEST_UPDATE',
  SYNC_INFORMATION = 'SYNC_INFORMATION',
  ACCEPT = 'ACCEPT', //phê duyệt yckh
  'BLOCK/UNBLOCK_SUBCRIBER' = 'BLOCK/UNBLOCK_SUBCRIBER',
  CANCEL_CTKM = 'CANCEL_CTKM',
  CHANGE_ZONE = 'CHANGE_ZONE',
  PROHIBIT_IMPACT = 'PROHIBIT_IMPACT',
  SEND_MAIL = 'SEND_MAIL',
  SUBCRIBE_UNSUBCRIBE = 'SUBCRIBE_UNSUBCRIBE',
  SUBCRIBE_UNSUBCRIBE_PACKAGE = 'SUBCRIBE_UNSUBCRIBE_PACKAGE',
  RE_CENSOR = 'RE_CENSOR',
  UPDATE_FULL = 'UPDATE_FULL',
  VIEW_APPROVAL_PROGRESS = 'VIEW_APPROVAL_PROGRESS',
  EXPORT_EXCEL = 'EXPORT_EXCEL',
  CANCEL_SUBSCRIPTION = 'CANCEL_SUBSCRIPTION',
  CREATE_DELIVER_ORDER = 'CREATE_DELIVER_ORDER',
  RESELVE_SHIPPING_UNIT = 'RESELVE_SHIPPING_UNIT',
  REFUND = 'REFUND',
  CREATE_MASH_REQUEST = 'CREATE_MASH_REQUEST',
  PRE_CENSOR = 'PRE_CENSOR',
  VIEW_UPDATE_HISTORY = 'VIEW_UPDATE_HISTORY',
  CLOSE = 'CLOSE',
  REOPEN = 'REOPEN',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  CREATE_DELIVERY = 'CREATE_DELIVERY', // action chọn lại đơn vị vận chuyển màn quản lý đơn onlineonline
  REFUND_REQUEST = 'REFUND_REQUEST', // action yêu cầu hoàn tiền màn quản lý đơn online cs
  RE_CRAFT_KIT = 'RE_CRAFT_KIT', // action ghép kit lại màn quản lý đơn online cs
  CANCEL_ORDER = 'CANCEL_ORDER', // action hủy đơn màn quản lý đơn online cs
  CREATE_ORDER_DELIVERY = 'CREATE_ORDER_DELIVERY', // action tạo đơn giao hàng màn quản lý đơn online
  TRANSLATE = 'TRANSLATE', // action dịch màn quản lý đơn online cs
  RECREATE_ORDER = 'RECREATE_ORDER',
}

export enum StatusEnum {
  SUCCESS = 0,
  FAIL = 1,
}

export const MAX_NUMBER = 99_999_999_999;
export const ImageFileType = ['image/png', 'image/jpeg', 'image/jpg'];

//dùng để phân biệt các page thêm, sửa, xoá
export enum ActionType {
  ADD = 'ADD',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  PARTNER_USER_MANAGER = 'PARTNER_USER_MANAGER', // Quản lý user đối tác danh mục đối tác
  COPY = 'COPY',
  VIEW_ENTERPRISE_HISTORY = 'VIEW_ENTERPRISE_HISTORY',
}
export const UploadFileMax = 500 * 1024; //500kB

export enum DateFormat {
  DEFAULT = 'DD/MM/YYYY',
  DEFAULT_SHORT = 'D/MM/YYYY',
  DEFAULT_V2 = 'DDMMYYYY',
  DEFAULT_V3 = 'DD.MM.YYYY',
  DEFAULT_V4 = 'DD-MM-YYYY',
  DATE_TIME = 'DD/MM/YYYY HH:mm:ss',
  DATE_TIME_LOCAL = 'HH:mm:ss DD/MM/YYYY',
  DATE_TIME_NO_SECOND = 'DD/MM/YYYY HH:mm',
  DATE_ISO = 'YYYY-MM-DD',
  EXPORT = 'DDMMYYYYHHmmss',
  TIME = 'HH:mm:ss',
}

export const SearchTimeMax = 1;

export const FILE_TYPE = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  csv: 'text/csv',
  zip: 'application/zip',
  txt: 'text/plain',
  jpg: 'image/jpg',
  png: 'image/png',
  jpeg: 'image/jpeg',
};

export enum KitProcessType {
  SINGLE = 1,
  BATCH = 2,
}

export enum DeliveryOrderType {
  INTERNAL = 1, // nội bộ
  NCC = 2, // nhà cung cấp
  PARTNER = 3, // đối tác
  OTHER = 4, // khác
  TRANSFER = 5, // điều chuyển,
  REVOKE = 6, // thu hồi
  PRODUCT_RETURN = 7, // trả hàng
  CRAFT_KIT = 8, // Ghép kit
  CANCEL_CRAFT_KIT = 9, // Hủy ghép kit
}
export enum DeliveryNoteMethod {
  EXPORT = 1,
  IMPORT = 2,
  RECALL = 3,
  RETURN = 4,
}

export enum DeliveryOrderMethod {
  EXPORT = 1,
  IMPORT = 2,
  REVOKE = 3,
  RETURN = 4,
}

export const FILE_SIZE_MAX_DEFAULT = 5 * 1024 * 1024;

export enum ImageType {
  CCCD = '1',
  HD = '2',
  HD_ND13 = '3',
  HD_COMMITMENT = '4',
  VIDEO_CALL = '6',
}

export enum ImageCode {
  FRONT = '1',
  BACK = '2',
  PORTRAIT = '3',
  INCLINE_PORTRAIT = '4',
}
export const SELECT_SIZE = 20;

export const TenMinutes = 600000;

export enum IDType {
  CCCD = '1',
  CMND = '2',
}
