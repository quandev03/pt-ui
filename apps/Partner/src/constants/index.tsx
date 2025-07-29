import { prefixAuthServicePublic } from 'apps/Partner/src/constants/app';


export const APP_CODE = 'vnsky-agent';

export const STORAGE_KEY_PREFIX =
  (window as unknown as { _env_: { [key: string]: string } })._env_
    ?.VITE_STORAGE_KEY_PREFIX ?? '';
export const ACCESS_TOKEN_KEY = `${STORAGE_KEY_PREFIX}${APP_CODE}:access_token`;
export const REFRESH_ACCESS_TOKEN_KEY = `${STORAGE_KEY_PREFIX}${APP_CODE}:refresh_token`;

export const USERNAME = 'username';
export const ADMIN_USER = 'owner';

export const OidcClientCredentials = {
  clientId:
    (window as unknown as { _env_: { [key: string]: string } })._env_
      ?.VITE_PARTNER_SITE_OIDC_CLIENT_ID ??
    import.meta.env.VITE_PARTNER_SITE_OIDC_CLIENT_ID,
  clientSecret:
    (window as unknown as { _env_: { [key: string]: string } })._env_
      ?.VITE_PARTNER_SITE_OIDC_CLIENT_SECRET ??
    import.meta.env.VITE_PARTNER_SITE_OIDC_CLIENT_SECRET,
};

export const authApi = {
  tokenUrl: `${prefixAuthServicePublic}/oauth2/token`,
};

export const FILE_TYPE = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  zip: 'application/zip',
  txt: 'text/plain',
  jpg: 'image/jpg',
  png: 'image/png',
  jpeg: 'image/jpeg',
};
