import { useMutation } from '@tanstack/react-query';
import { AuthServices } from '../services';
import { ILoginResponse, INewPass } from '../types';
import {
  IErrorResponse,
  IFieldErrorsItem,
  NotificationSuccess,
  StorageService,
} from '@vissoft-react/common';
import { AxiosError } from 'axios';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../../constants';

function useSupportGetNewPassword(
  onSuccess: (data: INewPass) => void,
  onError: (error: IErrorResponse) => void
) {
  return useMutation({
    mutationFn: AuthServices.getNewPassword,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      if (error.response) onError(error.response?.data);
    },
  });
}

function useSupportLoginLocal(
  onSuccess?: (data: ILoginResponse) => void,
  onError?: (error: IErrorResponse) => void
) {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: AuthServices.loginApi,
    onSuccess: (data) => {
      StorageService.setAccessToken(ACCESS_TOKEN_KEY, data.access_token);
      StorageService.setRefreshToken(REFRESH_TOKEN_KEY, data.refresh_token);
      onSuccess && onSuccess(data);
    },
    onError: (error: IErrorResponse) => {
      onError && onError(error);
    },
  });
}

function useSupportLogin(
  onSuccess?: () => void,
  onError?: (error: IErrorResponse) => void
) {
  return useMutation({
    mutationFn: AuthServices.loginSso,
    onSuccess: (data) => {
      StorageService.setAccessToken(ACCESS_TOKEN_KEY, data.access_token);
      StorageService.setRefreshToken(REFRESH_TOKEN_KEY, data.refresh_token);
      onSuccess && onSuccess();
    },
    onError: (error: IErrorResponse) => {
      onError && onError(error);
    },
  });
}

function useSupportInitFcm() {
  return useMutation({
    mutationFn: AuthServices.initFcm,
  });
}

function useSupportInitForgotPassword(
  onError: (errorField: IFieldErrorsItem[]) => void
) {
  return useMutation({
    mutationFn: AuthServices.initForgotPassword,
    onSuccess: (data) => {
      NotificationSuccess(
        'Vui lòng kiểm tra email và làm theo hướng dẫn để lấy lại mật khẩu.'
      );
    },
    onError(error: IErrorResponse) {
      if (error.errors) {
        onError(error?.errors);
      }
    },
  });
}
export {
  useSupportGetNewPassword,
  useSupportLoginLocal,
  useSupportLogin,
  useSupportInitFcm,
  useSupportInitForgotPassword,
};
