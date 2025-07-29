import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { useMutation } from '@tanstack/react-query';
import { IUserInfo } from 'apps/Partner/src/components/layouts/types';
import StorageService from 'apps/Partner/src/helpers/storageService';
import AuthServices from '../services';
import { ILoginResponse, INewPass } from '../types';
import { NotificationSuccess } from '@react/commons/Notification';
import { AxiosError } from 'axios';

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

export function useSupportGetProfile(onSuccess: (data: IUserInfo) => void) {
  return useMutation({
    mutationFn: AuthServices.getProfile,
    onSuccess: (data) => {
      onSuccess(data);
    },
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
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
}

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
