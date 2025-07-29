import { prefixCatalogServicePublic, prefixResourceServicePublic } from '@react/url/app';


export const API_PATHS = {
  UN_KEEP_ISDN: (isdn: string) =>
    `${prefixResourceServicePublic}/lookup-number/un-keep-isdn/${isdn}`,
  KEEP_ISDN: (isdn: string) =>
    `${prefixResourceServicePublic}/lookup-number/keep-isdn/${isdn}`,
  SEARCH: `${prefixResourceServicePublic}/lookup-number/partner`,
  HISTORY_ISDN: (isdn: string) =>
    `${prefixResourceServicePublic}/lookup-number/history-isdn/${isdn}`,
  GET_STOCK_ISDN: `${prefixCatalogServicePublic}/stock-isdn-org/combobox/stock-type`,
  GET_STATUS: `${prefixResourceServicePublic}/parameter`,
  exportExcel: `${prefixResourceServicePublic}/lookup-number/partner/export`,
};