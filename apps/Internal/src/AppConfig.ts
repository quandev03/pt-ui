export const GOOGLE_CLIENT_ID = (window as unknown as { _env_: { [key: string]: string } })._env_
  ?.VITE_GOOGLE_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const FIREBASE_CONFIG =
  (window as unknown as { _env_: { [key: string]: string } })._env_
    ?.VITE_FIREBASE_CONFIG_OBJECT ?? import.meta.env.VITE_FIREBASE_CONFIG_OBJECT;
export const FIREBASE_VAPID_KEY =
  (window as unknown as { _env_: { [key: string]: string } })._env_
    ?.VITE_FIREBASE_VAPID_KEY ?? import.meta.env.VITE_FIREBASE_VAPID_KEY;
export const APP_VERSION = (window as unknown as { _env_: { [key: string]: string } })._env_?.VITE_APP_VERSION;

