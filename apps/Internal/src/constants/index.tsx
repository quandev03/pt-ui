import { prefixAuthServicePrivate } from './app';

export const APP_CODE = 'vnsky-internal';

export const STORAGE_KEY_PREFIX = (window as unknown as { _env_: { [key: string]: string } })._env_?.VITE_STORAGE_KEY_PREFIX ?? '';
export const ACCESS_TOKEN_KEY = `${STORAGE_KEY_PREFIX}${APP_CODE}:access_token`;
export const REFRESH_TOKEN_KEY = `${STORAGE_KEY_PREFIX}${APP_CODE}:refresh_token`;
export const FCM_TOKEN_KEY = `${STORAGE_KEY_PREFIX}${APP_CODE}:fcm_token`;

export const USERNAME = 'username';
export const ADMIN_USER = 'owner';

export const OidcClientCredentials = {
  clientId:
    (window as unknown as { _env_: { [key: string]: string | number } })._env_
      ?.VITE_INTERNAL_SITE_OIDC_CLIENT_ID ??
    import.meta.env.VITE_INTERNAL_SITE_OIDC_CLIENT_ID,
  clientSecret:
    (window as unknown as { _env_: { [key: string]: string | number } })._env_
      ?.VITE_INTERNAL_SITE_CLIENT_SECRET ??
    import.meta.env.VITE_INTERNAL_SITE_CLIENT_SECRET,
};

export const authApi = {
  tokenUrl: `${prefixAuthServicePrivate}/oauth2/token`,
};
