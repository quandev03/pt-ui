import {
  IParamsOption,
  IUserInfo,
  LoaderData,
  MenuObjectItem,
} from '@vissoft-react/common';
import { prefixAuthService, prefixSaleService } from '../constants';
import { ParamKeys } from '../types';
import { safeApiClient } from './axios';

export const globalService = {
  async initApp(): Promise<LoaderData> {
    console.log('🚀 ~ globalService.initApp() called');
    try {
      console.log('🔄 ~ Creating promises...');
      const profilePromise = globalService.getProfile().catch(err => {
        console.error('❌ ~ getProfile failed:', err);
        return {} as IUserInfo;
      });
      const menuPromise = globalService.getMenu().catch(err => {
        console.error('❌ ~ getMenu failed:', err);
        return [];
      });
      const paramsPromise = globalService.getParamsOption().catch(err => {
        console.error('❌ ~ getParamsOption failed:', err);
        return {};
      });
      console.log('🔄 ~ Waiting for Promise.all...');
      const [profile, menuData, paramsData] = await Promise.all([
        profilePromise,
        menuPromise,
        paramsPromise,
      ]);
      console.log('✅ ~ Promise.all completed');
      console.log('📊 ~ Results breakdown:');
      console.log('  - profile:', profile ? 'loaded' : 'empty');
      console.log('  - menuData:', Array.isArray(menuData) ? `${menuData.length} items` : 'not array');
      console.log('  - paramsData:', paramsData ? 'loaded' : 'empty');
      console.log('📋 ~ menuData detail:', menuData);
      return {
        profile,
        menus: menuData,
        params: paramsData,
      };
    } catch (error) {
      console.error('❌ ~ globalService.initApp() failed:', error);
      return {
        profile: {} as IUserInfo,
        menus: [],
        params: {},
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
    console.log('🔄 ~ getMenu called, URL:', `${prefixAuthService}/api/auth/menu/flat`);
    
    // Check authentication
    const { StorageService } = await import('@vissoft-react/common');
    const { ACCESS_TOKEN_KEY } = await import('../constants');
    const token = StorageService.getAccessToken(ACCESS_TOKEN_KEY);
    console.log('🔑 ~ Access token check:', token ? 'EXISTS' : 'MISSING');
    console.log('🔑 ~ Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
    
    // If no token, return mock data for development
    if (!token) {
      console.log('⚠️ ~ No access token, using mock data for development');
      const mockMenuData: MenuObjectItem[] = [
        {
          code: "DASHBOARD",
          name: "Tổng quan", 
          uri: "/dashboard",
          actions: ['READ'] as any,
          items: []
        },
        {
          code: "USER_MANAGEMENT",
          name: "Tài khoản",
          uri: "/user-manager", 
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'] as any,
          items: []
        },
        {
          code: "ROLE_MANAGEMENT",
          name: "Vai trò & Phân quyền",
          uri: "/role-manager",
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'] as any, 
          items: []
        }
      ];
      return mockMenuData;
    }
    
    try {
      const res = await safeApiClient.get<MenuObjectItem[]>(
        `${prefixAuthService}/api/auth/menu/flat`
      );
      console.log('✅ ~ API getMenu raw response:', res);
      console.log('📊 ~ Response type:', typeof res, 'isArray:', Array.isArray(res));
      
      if (!res) {
        console.warn('⚠️ ~ API response is null/undefined');
        return [];
      }
      
      if (!Array.isArray(res)) {
        console.warn('⚠️ ~ API response is not an array:', res);
        return [];
      }
      
      console.log('✅ ~ Returning menu data:', res.length, 'items');
      return res;
    } catch (error) {
      console.error('❌ ~ getMenu failed:', error);
      throw error;
    }
  },
  getParamsOption() {
    return safeApiClient.get<IParamsOption<ParamKeys>>(
      `${prefixSaleService}/params`
    );
  },
};
