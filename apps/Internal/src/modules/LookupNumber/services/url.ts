import { prefixSaleService } from 'apps/Internal/src/constants';

export const API_PATHS = {
  UN_KEEP_ISDN: (isdn: string) =>
    `${prefixSaleService}/lookup-number/un-keep-isdn/${isdn}`,
  KEEP_ISDN: (isdn: string) =>
    `${prefixSaleService}/lookup-number/keep-isdn/${isdn}`,
  SEARCH: `${prefixSaleService}/lookup-number`,
  HISTORY_ISDN: (isdn: string) =>
    `${prefixSaleService}/lookup-number/history-isdn/${isdn}`,
  GET_STOCK_ISDN: `${prefixSaleService}/stock-isdn-org/combobox/stock-type`,
  GET_STATUS: `${prefixSaleService}/parameter`,
  exportExcel: `${prefixSaleService}/lookup-number/export`,
};
