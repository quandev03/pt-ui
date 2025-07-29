import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { useMutation } from '@tanstack/react-query';
import StorageService from 'apps/Internal/src/helpers/storageService';
import { AuthServices } from 'apps/Internal/src/modules/Auth/services';
import { INewPass } from 'apps/Internal/src/modules/Auth/types';
import { AxiosError } from 'axios';
import { ILoginResponse } from '../types';

export function useSupportGetNewPassword(
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

export function useSupportLoginLocal(
  onSuccess?: (data: ILoginResponse) => void,
  onError?: (error: IErrorResponse) => void
) {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: AuthServices.loginApi,
    onSuccess: (data) => {
      StorageService.setAccessToken(data.access_token);
      StorageService.setRefreshToken(data.refresh_token);
      onSuccess && onSuccess(data);
    },
    onError: (error: IErrorResponse) => {
      onError && onError(error);
    },
  });
}

export function useSupportLogin(
  onSuccess?: () => void,
  onError?: (error: IErrorResponse) => void
) {
  return useMutation({
    mutationFn: AuthServices.loginSso,
    onSuccess: (data) => {
      StorageService.setAccessToken(data.access_token);
      StorageService.setRefreshToken(data.refresh_token);
      onSuccess && onSuccess();
    },
    onError: (error: IErrorResponse) => {
      onError && onError(error);
    },
  });
}

export function useSupportInitFcm() {
  return useMutation({
    mutationFn: AuthServices.initFcm,
  });
}

export function useSupportInitForgotPassword(
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
