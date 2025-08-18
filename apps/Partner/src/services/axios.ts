import {
  ApiError,
  CommonError,
  NotificationWarning,
  StorageService,
  TokenResponse,
} from '@vissoft-react/common';
import { notification } from 'antd';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  ACCESS_TOKEN_KEY,
  OidcClientCredentials,
  REFRESH_TOKEN_KEY,
  baseApiUrl,
  prefixAuthService,
} from '../constants';
import useConfigAppStore from '../modules/Layouts/stores';

export const authApi = {
  tokenUrl: `${prefixAuthService}/oauth2/token`,
};

const STATUS_TOKEN_EXPIRED = 401;
const API_REQUEST_TIMEOUT = 60000; // 60s

// Improved typing for failed requests
interface FailedRequest {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      request.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosClient = axios.create({
  baseURL: baseApiUrl,
  timeout: API_REQUEST_TIMEOUT,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleRequest = (req: InternalAxiosRequestConfig) => {
  req.headers = req.headers ?? {};
  const token = StorageService.getAccessToken(ACCESS_TOKEN_KEY);
  if (token && !req.headers['Authorization']) {
    req.headers['Authorization'] = `Bearer ${token}`;
  }
  req.headers['Accept-Language'] = 'vi-VN';
  return req;
};

const handleRequestError = (error: AxiosError) => {
  console.error('Request error:', error);
  return Promise.reject(error);
};

const resInterceptor = (response: AxiosResponse) => {
  return response;
};

const errInterceptor = async (
  error: AxiosError
): Promise<AxiosResponse | never> => {
  const httpCode = error?.response?.status;
  const config = error?.config;

  // Handle token refresh
  if (httpCode === STATUS_TOKEN_EXPIRED && config?.url !== authApi.tokenUrl) {
    if ((config as any)?._retry) {
      await useConfigAppStore.getState().logoutStore();
      return Promise.reject(error);
    }
    const refreshToken = StorageService.getRefreshToken(REFRESH_TOKEN_KEY);

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (config?.headers) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
            axiosClient(config!).then(resolve).catch(reject);
          },
          reject,
        });
      })
        .then((token) => {
          if (config?.headers) {
            (config as any)._retry = true;
            config.headers['Authorization'] = `Bearer ${token}`;
          }
          return axiosClient(config!);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
    isRefreshing = true;

    if (!refreshToken) {
      notification.destroy();
      const tokenError = new Error('Không tìm thấy refresh token');
      processQueue(tokenError, null);
      isRefreshing = false;
      await useConfigAppStore.getState().logoutStore();
      return Promise.reject(tokenError);
    }

    try {
      const bodyRefresh = new URLSearchParams();
      bodyRefresh.append('grant_type', 'refresh_token');
      bodyRefresh.append('refresh_token', refreshToken);

      const response = await axios.post<TokenResponse>(
        authApi.tokenUrl,
        bodyRefresh,
        {
          baseURL: baseApiUrl,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(
              OidcClientCredentials.clientId +
                ':' +
                OidcClientCredentials.clientSecret
            )}`,
          },
        }
      );

      const token = response.data.access_token;
      StorageService.setAccessToken(ACCESS_TOKEN_KEY, token);
      processQueue(null, token);

      // Retry original request
      if (config?.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return axiosClient(config!);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);

      if (axios.isAxiosError(refreshError)) {
        const refreshStatus = refreshError.response?.status;
        if (refreshStatus === STATUS_TOKEN_EXPIRED) {
          await useConfigAppStore.getState().logoutStore();
          NotificationWarning(
            'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
          );
          return Promise.reject(new Error('Phiên đăng nhập đã hết hạn'));
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  // Handle different error types
  const errorData: CommonError | Blob = error?.response?.data as
    | CommonError
    | Blob;

  if (errorData instanceof Blob) {
    return Promise.reject(errorData);
  }

  const apiError = errorData as CommonError;

  // Only show notification for errors without field-specific errors
  if (!apiError?.errors || apiError.errors.length === 0) {
    notification.error({
      message: apiError?.title || 'Lỗi hệ thống',
      description: apiError?.detail || 'Có lỗi xảy ra, vui lòng thử lại sau',
    });
  }

  return Promise.reject(apiError || error);
};

// Add interceptors
axiosClient.interceptors.request.use(handleRequest, handleRequestError);
axiosClient.interceptors.response.use(resInterceptor, errInterceptor);

// Improved safe request wrapper with better typing
export const safeRequest = async <T>(
  requestPromise: Promise<AxiosResponse<T>>,
  errorHandler?: (error: ApiError) => T
): Promise<T> => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    if (errorHandler && axios.isAxiosError(error)) {
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: error.message,
        errors: error.response?.data?.errors,
        timestamp: new Date().toISOString(),
        path: error.config?.url,
      };
      return errorHandler(apiError);
    }

    throw error;
  }
};

// Safe request wrapper that returns full response (for file downloads)
export const safeRequestWithResponse = async <T>(
  requestPromise: Promise<AxiosResponse<T>>,
  errorHandler?: (error: ApiError) => AxiosResponse<T>
): Promise<AxiosResponse<T>> => {
  try {
    const response = await requestPromise;
    return response;
  } catch (error) {
    console.error('API request error:', error);

    if (errorHandler && axios.isAxiosError(error)) {
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: error.message,
        errors: error.response?.data?.errors,
        timestamp: new Date().toISOString(),
        path: error.config?.url,
      };
      return errorHandler(apiError);
    }

    throw error;
  }
};

// Typed API client with better error handling
export const safeApiClient = {
  get: <T>(url: string, config?: Partial<InternalAxiosRequestConfig>) =>
    safeRequest<T>(axiosClient.get<T>(url, config)),

  post: <T>(
    url: string,
    data?: unknown,
    config?: Partial<InternalAxiosRequestConfig>
  ) => safeRequest<T>(axiosClient.post<T>(url, data, config)),

  put: <T>(
    url: string,
    data?: unknown,
    config?: Partial<InternalAxiosRequestConfig>
  ) => safeRequest<T>(axiosClient.put<T>(url, data, config)),

  delete: <T>(url: string, config?: Partial<InternalAxiosRequestConfig>) =>
    safeRequest<T>(axiosClient.delete<T>(url, config)),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: Partial<InternalAxiosRequestConfig>
  ) => safeRequest<T>(axiosClient.patch<T>(url, data, config)),
};

// Utility functions for common API patterns
export const apiUtils = {
  // Create form data for file uploads
  createFormData: (data: Record<string, unknown>): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, String(item));
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return formData;
  },

  // Handle download responses with automatic filename extraction
  handleDownloadResponse: (
    response: AxiosResponse<Blob>,
    fallbackFilename?: string
  ) => {
    // Extract filename from content-disposition header
    const getFilenameFromResponse = (response: AxiosResponse): string => {
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        // Try different patterns to extract filename
        const patterns = [
          /filename\*=UTF-8''([^;]+)/i, // RFC 5987 format
          /filename="([^"]+)"/i, // Standard quoted format
          /filename=([^;]+)/i, // Unquoted format
        ];

        for (const pattern of patterns) {
          const match = contentDisposition.match(pattern);
          if (match) {
            let filename = match[1];
            // Decode URI components if needed
            try {
              filename = decodeURIComponent(filename);
            } catch {
              // If decoding fails, use original filename
            }
            return filename;
          }
        }
      }
      return fallbackFilename || 'download';
    };

    const filename = getFilenameFromResponse(response);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return filename; // Return extracted filename
  },

  // Download file with response headers
  downloadFile: async (
    url: string,
    config?: Partial<InternalAxiosRequestConfig>,
    fallbackFilename?: string
  ) => {
    const response = await safeRequestWithResponse<Blob>(
      axiosClient.get<Blob>(url, {
        ...config,
        responseType: 'blob',
      })
    );

    return apiUtils.handleDownloadResponse(response, fallbackFilename);
  },
};
