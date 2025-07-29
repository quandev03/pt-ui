import { prefixCatalogServicePublic } from '@react/url/app';
import {
  prefixCatalogService,
  prefixResourceService,
  prefixSaleService,
} from 'apps/Internal/src/constants/app';

export const API_PATHS = {
  CATALOG_REASON: `${prefixCatalogService}/reason/get-reason-by-type`,
  GET_NUMBER: `${prefixResourceService}/look-up-number/search`,
  PRODUCTS: `${prefixCatalogService}/product/search`,
  STOCK_MOVE: `${prefixSaleService}/stock-move/ticket-in-other`,
  ORG_ID: `${prefixCatalogServicePublic}/organization-user/get-all-organization-by-user`,
  GET_DATA_FILE_EXPORT: `${prefixSaleService}/stock-move/action/get-data-in`,
  GET_CHOOSE_PRODUCT: `${prefixCatalogService}/product/search-products-for-import-or-export`,
  GET_CHOOSE_PRODUCT_IMPORT: `${prefixCatalogService}/product/search-products-for-import`,
  FILTER_SERIAL: `${prefixSaleService}/stock-product/auto-filter-serial`,
  GET_FILE_EXCEL: `${prefixSaleService}/stock-move/action/get-excel`,
  PRODUCT_CATEGORY: `${prefixCatalogService}/product-category`,
  GET_DETAIL_TRANSACTION: (id: string) =>
    `${prefixSaleService}/stock-move/${id}`,
};
