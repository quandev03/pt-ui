import {
  IParamsOption,
  IUserInfo,
  LoaderData,
  MenuObjectItem,
} from '@vissoft-react/common';
import { prefixAuthService, prefixSaleService } from '../constants';
import { ParamKeys } from '../types';
import { safeApiClient } from './axios';
import { IDebitLimit } from '../hooks/useGetDebitLimit';

export const globalService = {
  async initApp(): Promise<LoaderData> {
    try {
      const profilePromise = globalService.getProfile();
      const menuPromise = globalService.getMenu();
      const [profile, menuData] = await Promise.all([
        profilePromise,
        menuPromise,
      ]);
      return {
        profile,
        menus: menuData,
      };
    } catch {
      return {
        profile: {} as IUserInfo,
        menus: [],
      };
    }
  },

  getProfile: async () => {
    const res = await safeApiClient.get<IUserInfo>(
      `${prefixAuthService}/api/auth/profile`
    );
    if (!res) throw new Error('Không thể lấy profile');
    return res;
  },
  getMenu: async () => {
    const res = await safeApiClient.get<MenuObjectItem[]>(
      `${prefixAuthService}/api/auth/menu/flat`
    );
    if (!res) throw new Error('Không thể lấy menu');
    return res;
  },
  getParamsOption() {
    return safeApiClient.get<IParamsOption<ParamKeys>>(
      `${prefixSaleService}/params`
    );
  },
  getDebitLimit: async () => {
    const res = await safeApiClient.get<IDebitLimit>(
      `${prefixAuthService}/api/clients/agent-debit`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
};
