import { prefixAuthService } from '@react/url/app';

export const versionApi = '/v1';

export const baseApiUrl =
  (window as unknown as { _env_: { [key: string]: string | number } })._env_
    ?.VITE_BASE_API_URL ?? import.meta.env.VITE_BASE_API_URL;

export const baseSignUrl =
  (window as unknown as { _env_: { [key: string]: string } })._env_
    ?.VITE_BASE_SIGNLINK_URL ?? import.meta.env.VITE_BASE_SIGNLINK_URL;

export const prefixAuthServicePublic = `${prefixAuthService}/public`;
export const prefixSaleService = 'sale-service/public/api' + versionApi;
export const prefixCatalogServicePublic =
  'catalog-service/public/api' + versionApi;
export const prefixApprovalService = 'approval-service/public/api' + versionApi;
