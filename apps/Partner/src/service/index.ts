import { notification } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import useConfigAppStore from '../components/layouts/store';
import { authApi, OidcClientCredentials } from '../constants';
import { baseApiUrl } from '../constants/app';
import StorageService from '../helpers/storageService';
import { ILoginResponse } from '../modules/Auth/types';
import useLanguageStore from '../languages/store';
import { CommonError } from '@react/commons/types';
import {
  NotificationError,
  NotificationWarning,
} from '@react/commons/Notification';
import useFileNameDownloaded from '../components/layouts/store/useFileNameDownloaded';
import { isNil } from 'lodash';

const urlsToIgnoreReturnData = ['report-service'];
const STATUS_TOKEN_EXPIRED = 401;
const API_REQUEST_TIMEOUT = 60000; // 20s

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosClient = axios.create({
  baseURL: baseApiUrl,
  timeout: API_REQUEST_TIMEOUT,
  responseType: 'json',
  withCredentials: false,
});

const handleRequest = (req: AxiosRequestConfig) => {
  req.headers = req.headers ?? {};
  const token = StorageService.getAccessToken();
  if (token) {
    if (!req.headers['Authorization']) {
      req.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  req.headers['Accept-Language'] = 'vi-VN';
  req.headers['Accept'] = '*';

  return req;
};

const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-.]+)(?:; ?|$)/i;
const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

const extractFilenameFromContentDisposition = (disposition: string) => {
  let fileName = 'attachment';
  if (utf8FilenameRegex.test(disposition)) {
    fileName = decodeURIComponent(
      (utf8FilenameRegex.exec(disposition) as RegExpExecArray)[1]
    );
  } else {
    // prevent ReDos attacks by anchoring the ascii regex to string start and
    //  slicing off everything before 'filename='
    const filenameStart = disposition.toLowerCase().indexOf('filename=');
    if (filenameStart >= 0) {
      const partialDisposition = disposition.slice(filenameStart);
      const matches = asciiFilenameRegex.exec(partialDisposition);
      if (matches != null && matches[2]) {
        fileName = matches[2];
      }
    }
  }
  return fileName;
};

const handleRequestError = (error: any) => {
  return Promise.reject(error);
};

//handle response api
const resInterceptor = (response: AxiosResponse) => {
  if (response.headers['content-disposition']) {
    const filename = extractFilenameFromContentDisposition(
      response.headers['content-disposition']
    );
    useFileNameDownloaded.getState().setName(filename);
  }
  const resURL = response.config.url ?? '';
  if (urlsToIgnoreReturnData.some((item) => resURL.startsWith(item)))
    return response;

  if (response && !isNil(response.data)) {
    return response.data;
  }
  return response;
};

const errInterceptor = (error: any) => {
  const httpCode = error?.response?.status;
  const config = error?.response?.config;
  if (error?.response.headers['content-disposition']) {
    const filename = extractFilenameFromContentDisposition(
      error?.response.headers['content-disposition']
    );
    useFileNameDownloaded.getState().setName(filename);
  }
  // Handle some special http errors
  if (
    [403, 404, 500, 501, 502, 503, 504].includes(httpCode) ||
    httpCode === undefined
  ) {
    return Promise.reject(error);
  }
  if (httpCode === STATUS_TOKEN_EXPIRED && config?.url !== authApi.tokenUrl) {
    const refreshToken = StorageService.getRefreshToken();

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          error.config.headers['Authorization'] = 'Bearer ' + token;
          return axios(error.config);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    error.config._retry = true;
    isRefreshing = true;

    if (!refreshToken) {
      notification.destroy();
      return;
    }
    const bodyRefresh = new URLSearchParams();
    bodyRefresh.append('grant_type', 'refresh_token');
    bodyRefresh.append('refresh_token', refreshToken);
    return axios
      .post<ILoginResponse>(authApi.tokenUrl, bodyRefresh, {
        baseURL: baseApiUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            OidcClientCredentials.clientId +
              ':' +
              OidcClientCredentials.clientSecret
          )}`,
        },
      })
      .then((response) => {
        const token = response?.data?.access_token;

        StorageService.setAccessToken(token);
        processQueue(null, token);
        return new Promise((resolve, reject) => {
          axiosClient
            .request({
              ...config,
              headers: {
                ...config?.headers,
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response: any) => {
              resolve(response);
            })
            .catch((error: any) => {
              reject(error);
            });
        });
      })
      .catch((errorRefresh) => {
        processQueue(errorRefresh, null);
        if (
          errorRefresh.status === 401 ||
          errorRefresh?.config?.url === authApi.tokenUrl
        ) {
          useConfigAppStore.getState().logoutStore();
          const intl = useLanguageStore.getState().intl;
          const message =
            intl?.formatMessage({ id: 'auth.sessionExpired' }) ??
            'Session expired, please login again';
          NotificationWarning(message);
          return Promise.resolve();
        }
        return Promise.reject(errorRefresh?.response?.data);
      })
      .finally(() => {
        isRefreshing = false;
      });
  }

  if (error?.response?.headers['content-disposition']) {
    const fileName = error?.response?.headers['content-disposition']
      .split(';')[1]
      .split('=')[1]
      .replace(/"/g, '');
    useFileNameDownloaded.getState().setName(fileName);
  }

  if (error?.response?.headers['content-disposition']) {
    const fileName = error?.response?.headers['content-disposition']
      .split(';')[1]
      .split('=')[1]
      .replace(/"/g, '');
    useFileNameDownloaded.getState().setName(fileName);
  }

  const CError: CommonError = error?.response?.data;
  if (CError instanceof Blob) {
    return Promise.reject(CError);
  } else if (
    (!CError.errors || CError.errors.length === 0) &&
    error?.response?.status !== 404
  ) {
    NotificationError(CError);
  }
  return Promise.reject(CError);
};

axiosClient.interceptors.request.use(handleRequest as any, handleRequestError);
axiosClient.interceptors.response.use(resInterceptor, errInterceptor);

export { axiosClient };
