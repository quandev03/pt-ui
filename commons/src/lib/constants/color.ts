export const ColorList = {
  SUCCESS: 'success', //  thành công, Đã phê duyệt, Hoàn thành, Hoạt động
  PROCESSING: 'processing', // Đang xử lý, đang phê duyệt
  FAIL: 'error', // thất bại, không thành công
  WAITING: 'warning', // Chờ xử lý 1 cái gì đó
  CANCEL: 'default', // Hủy
  DEFAULT: 'default', // Hủy
} as const;
