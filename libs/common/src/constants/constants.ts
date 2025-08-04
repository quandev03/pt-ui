export const ColorList = {
  SUCCESS: 'success', //  thành công, Đã phê duyệt, Hoàn thành, Hoạt động
  PROCESSING: 'processing', // Đang xử lý, đang phê duyệt
  FAIL: 'error', // thất bại, không thành công
  WAITING: 'warning', // Chờ xử lý 1 cái gì đó
  CANCEL: 'default', // Hủy
  DEFAULT: 'default', // Hủy
} as const;

export const ApprovalProcessKey = {
  ORGANIZATION_UNIT: 'ORGANIZATION_UNIT',
};

export const UploadFileMax = 500 * 1024; //500kB

export const FILE_SIZE_MAX_DEFAULT = 10 * 1024 * 1024; //10mb

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
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export const TenMinutes = 10 * 60 * 1000;
export const ImageFileType = ['image/png', 'image/jpeg', 'image/jpg'];
