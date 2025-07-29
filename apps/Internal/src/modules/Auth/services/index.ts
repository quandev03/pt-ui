import {
  IInitPayload,
  ILoginDataRequest,
  ILoginResponse,
  INewPass,
} from 'apps/Internal/src/modules/Auth/types';
import { authApi, OidcClientCredentials } from 'apps/Internal/src/constants';
import {
  baseApiUrl,
  prefixAuthServicePrivate,
} from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  requestFcmToken,
  revokeFcmToken,
} from 'apps/Internal/src/service/firebase';
import StorageService from 'apps/Internal/src/helpers/storageService';
import { IUserInfo } from 'apps/Internal/src/components/layouts/types';
import axios from 'axios';

export const AuthServices = {
  getNewPassword: async (token: { token: string }) => {
    const res = await axios.post<INewPass>(
      `${baseApiUrl}${prefixAuthServicePrivate}/api/auth/forgot-password/confirm`,
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
  loginSso: async (authCode: string) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'sso');
    params.append('sso_provider', 'google');
    params.append('code', authCode);
    params.append('origin', window.location.origin);
    const res = await axiosClient.post<any, ILoginResponse>(
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
        },
      }
    );
    return res;
  },
  getProfile: async () => {
    const res = await axiosClient.get<string, IUserInfo>(
      `${prefixAuthServicePrivate}/api/auth/profile`
    );
    return res;
  },
  initFcm: async () => {
    try {
      const formReq = new URLSearchParams();
      let fcmToken = await requestFcmToken();
      formReq.set('token', fcmToken);
      const res = await axiosClient.post<any, { count: number }>(
        `${prefixAuthServicePrivate}/api/auth/fcm/init`,
        formReq,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      if (res.count === 0) {
        await revokeFcmToken();
        fcmToken = await requestFcmToken();
        formReq.set('token', fcmToken);
        await axiosClient.post<any, { count: number }>(
          `${prefixAuthServicePrivate}/api/auth/fcm/init`,
          formReq,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
      }
      if (fcmToken) {
        StorageService.setFcmToken(fcmToken);
      }
    } catch (e) {
      console.error('Error init FCM token', e);
    }
  },
  initForgotPassword: async (payload: IInitPayload) => {
    return await axiosClient.post(
      `${prefixAuthServicePrivate}/api/auth/forgot-password/init`,
      payload
    );
  },
};
