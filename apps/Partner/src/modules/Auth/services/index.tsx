import { authApi, OidcClientCredentials } from 'apps/Partner/src/constants';
import {
  baseApiUrl,
  prefixAuthServicePublic,
} from 'apps/Partner/src/constants/app';
import { axiosClient } from 'apps/Partner/src/service';
import {
  IInitPayload,
  ILoginDataRequest,
  ILoginResponse,
  INewPass,
} from '../types';

const AuthServices = {
  loginApi: async (data: ILoginDataRequest) => {
    const bodyAccess = new URLSearchParams();
    bodyAccess.append('grant_type', 'password');
    bodyAccess.append('client_identity', data.client_identity);
    bodyAccess.append('username', data.username);
    bodyAccess.append('password', data.password);
    return await axiosClient.post<any, ILoginResponse>(
      authApi.tokenUrl,
      bodyAccess,
      {
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
  },
  initForgotPassword: async (payload: IInitPayload) => {
    return await axiosClient.post(
      `${baseApiUrl}${prefixAuthServicePublic}/api/auth/forgot-password/init`,
      payload
    );
  },
  getNewPassword: async (token: { token: string }) => {
    return await axiosClient.post<string, INewPass>(
      `${baseApiUrl}${prefixAuthServicePublic}/api/auth/forgot-password/confirm`,
      token
    );
  },
};

export default AuthServices;
