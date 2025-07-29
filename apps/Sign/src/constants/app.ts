export const baseApiUrl =
  (window as unknown as { _env_: { [key: string]: string } })._env_
    ?.VITE_BASE_API_URL ?? import.meta.env.VITE_BASE_API_URL;
