import { IUserInfo, StorageService } from '@vissoft-react/common';
import axios, { AxiosRequestHeaders } from 'axios';
import {
  FCM_TOKEN_KEY,
  OidcClientCredentials,
  baseApiUrl,
  prefixAuthService,
} from '../../../constants';
import { authApi, safeApiClient } from '../../../services/axios';
import { requestFcmToken, revokeFcmToken } from '../../../services/firebase';
import {
  IInitPayload,
  ILoginDataRequest,
  ILoginResponse,
  INewPass,
} from '../types';

export const AuthServices = {
  getNewPassword: async (token: { token: string }) => {
    const res = await axios.post<INewPass>(
      `${baseApiUrl}${prefixAuthService}/api/auth/forgot-password/confirm`,
      token
    );
    return res.data;
  },
  loginApi: async (data: ILoginDataRequest) => {
    const bodyAccess = new URLSearchParams();
    bodyAccess.append('grant_type', 'password');
    bodyAccess.append('client_identity', 'VNSKY');
    bodyAccess.append('username', data.username);
    bodyAccess.append('password', data.password);
    return await safeApiClient.post<ILoginResponse>(
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
        } as AxiosRequestHeaders,
      }
    );
  },
  loginSso: async (authCode: string) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'sso');
    params.append('sso_provider', 'google');
    params.append('code', authCode);
    params.append('origin', window.location.origin);
    const res = await safeApiClient.post<ILoginResponse>(
      authApi.tokenUrl,
      params,
      {
        baseURL: baseApiUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            OidcClientCredentials.clientId +
              ':' +
              OidcClientCredentials.clientSecret
          )}`,
        } as AxiosRequestHeaders,
      }
    );
    return res;
  },
  getProfile: async () => {
    const res = await safeApiClient.get<IUserInfo>(
      `${prefixAuthService}/api/auth/profile`
    );
    return res;
  },
  initFcm: async () => {
    try {
      const formReq = new URLSearchParams();
      let fcmToken = await requestFcmToken();
      formReq.set('token', fcmToken);
      const res = await safeApiClient.post<{ count: number }>(
        `${prefixAuthService}/api/auth/fcm/init`,
        formReq,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          } as AxiosRequestHeaders,
        }
      );
      if (res.count === 0) {
        await revokeFcmToken();
        fcmToken = await requestFcmToken();
        formReq.set('token', fcmToken);
        await safeApiClient.post<{ count: number }>(
          `${prefixAuthService}/api/auth/fcm/init`,
          formReq,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            } as AxiosRequestHeaders,
          }
        );
      }
      if (fcmToken) {
        StorageService.setFcmToken(FCM_TOKEN_KEY, fcmToken);
      }
    } catch (e) {
      console.error('Error init FCM token', e);
    }
  },
  initForgotPassword: async (payload: IInitPayload) => {
    return await safeApiClient.post(
      `${prefixAuthService}/api/auth/forgot-password/init`,
      payload
    );
  },
};
