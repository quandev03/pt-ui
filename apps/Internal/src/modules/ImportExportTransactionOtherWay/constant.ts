export const ORG_ID = [
  {
    label: 'VNSKY',
    value: 1,
  },
];
export const ELEMENT_MODE = {
  SINGLE: 'single',
  FILE: 'file',
};

export const CODE_MODE_TYPE = {
  EXPORT: 1,
  IMPORT: 2,
};
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const CSV_TYPE = 'text/csv';
export const IE_ORG_ID = 116;

export const FIELD_NAMES: { [key: string]: string } = {
  productCode: 'Mã sản phẩm',
  fromSerial: 'Serial đầu',
  toSerial: 'Serial cuối',
  productUom: 'Số lượng',
  productName: 'Tên sản phẩm',
};
export const FIELDS_TO_CHECK = [
  { field: 'fromSerial', message: 'Serial đầu không được để trống' },
  { field: 'productName', message: 'Tên sản phẩm không được để trống' },
  { field: 'productCode', message: 'Mã sản phẩm không được để trống' },
  { field: 'toSerial', message: 'Serial cuối không được để trống' },
  { field: 'productUom', message: 'Số lượng không được để trống' },
];
export const TITLE_KEY_FILE_EXCEL = [
  'Mã sản phẩm',
  'Tên sản phẩm',
  'Serial đầu',
  'Serial cuối',
  'Số lượng',
];
export const DEFAULT_SEARCH_PARAMS = {
  'value-search': null,
  status: null,
};
export const DEFAULT_PARAMS = {
  page: 0,
  size: 10,
};
export const exportReasonTypeId = 4;
export const productCategories = [
  { label: 'SIM Trắng', value: '1' },
  { label: 'eSIM', value: '2' },
  { label: 'KIT', value: '3' },
  { label: 'Phí chọn số', value: '4' },
  { label: 'Gói cước', value: '5' },
  { label: 'Dịch vụ', value: '6' },
];
