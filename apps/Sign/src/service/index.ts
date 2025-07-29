import { NotificationError } from '@react/commons/Notification';
import { CommonError } from '@react/commons/types';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseApiUrl } from '../constants/app';

const API_REQUEST_TIMEOUT = 60000; // 20s

const axiosClient = axios.create({
  baseURL: baseApiUrl,
  timeout: API_REQUEST_TIMEOUT,
  responseType: 'json',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const handleRequest = (req: AxiosRequestConfig) => {
  req.headers = req.headers ?? {};
  req.headers['Accept-Language'] = 'vi-VN';
  req.headers['Accept'] = '*';
  return req;
};

const handleRequestError = (error: any) => {
  return Promise.reject(error);
};

//handle response api
const resInterceptor = (response: AxiosResponse) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
};

const errInterceptor = async (error: any) => {
  let CError: CommonError = error?.response?.data;

  if (
    error.request.responseType === 'blob' &&
    error.response.data instanceof Blob &&
    error.response.data.type &&
    error.response.data.type.toLowerCase().indexOf('json') !== -1
  ) {
    CError = JSON.parse(await error?.response?.data?.text());
  }

  NotificationError(CError?.detail || CError);
  return Promise.reject(CError);
};

axiosClient.interceptors.request.use(handleRequest as any, handleRequestError);
axiosClient.interceptors.response.use(resInterceptor, errInterceptor);

export { axiosClient };
