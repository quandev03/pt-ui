import {
  prefixCatalogServicePublic,
  prefixResourceService,
} from '@react/url/app';
import { exportExcel } from '.';

export const API_PATHS = {
  UN_KEEP_ISDN: (isdn: string) =>
    `${prefixResourceService}/lookup-number/un-keep-isdn/${isdn}`,
  KEEP_ISDN: (isdn: string) =>
    `${prefixResourceService}/lookup-number/keep-isdn/${isdn}`,
  SEARCH: `${prefixResourceService}/lookup-number`,
  HISTORY_ISDN: (isdn: string) =>
    `${prefixResourceService}/lookup-number/history-isdn/${isdn}`,
  GET_STOCK_ISDN: `${prefixCatalogServicePublic}/stock-isdn-org/combobox/stock-type`,
  GET_STATUS: `${prefixResourceService}/parameter`,
  exportExcel: `${prefixResourceService}/lookup-number/export`,
};
