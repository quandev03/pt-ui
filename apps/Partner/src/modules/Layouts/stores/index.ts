import {
  IParamsOption,
  IUserInfo,
  LoaderData,
  MenuObjectItem,
  StorageService,
} from '@vissoft-react/common';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  ACCESS_TOKEN_KEY,
  APP_CODE,
  FCM_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  STORAGE_KEY_PREFIX,
  USERNAME,
} from '../../../constants';
import { layoutPageService } from '../services';
import { ParamKeys } from '../../../types';
export interface IConfigAppStore {
  collapsedMenu: boolean;
  toggleCollapsedMenu: () => void;

  showNotify: boolean;
  setShowNotify: (open: boolean) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (open: boolean) => void;

  showChangePassModal: boolean;
  setShowChangePassModal: (open: boolean) => void;

  userLogin: IUserInfo | null;
  setUserLogin: (userLogin: IUserInfo) => void;

  openChangePassword: boolean;
  setOpenChangePassword: (openChangePassword: boolean) => void;

  menuData: MenuObjectItem[];
  setMenuData: (menuData: MenuObjectItem[]) => void;

  urlsActive: string[];
  setUrlsActive: (urlsActive: string[]) => void;

  params: IParamsOption<ParamKeys>;
  setParams: (params: IParamsOption<ParamKeys>) => void;

  logoutStore: () => Promise<void>;
  setInitApp: (data: LoaderData<ParamKeys>) => void;
}

const useConfigAppStore = create(
  persist<IConfigAppStore>(
    (set, getState) => ({
      collapsedMenu: false,
      toggleCollapsedMenu() {
        const state = getState();
        set(() => ({ collapsedMenu: !state.collapsedMenu }));
      },

      showNotify: false,
      setShowNotify(open) {
        set(() => ({ showNotify: open }));
      },

      isAuthenticated: false,
      setIsAuthenticated(isLogined) {
        set(() => ({ isAuthenticated: isLogined }));
      },

      showChangePassModal: false,
      setShowChangePassModal(show) {
        set(() => ({ showChangePassModal: show }));
      },

      userLogin: null,
      setUserLogin(userLogin) {
        const groups = userLogin.groups?.map((e) => e.id);
        const groupOptions = userLogin.groups?.map((e) => ({
          value: e.id,
          label: e.name,
        }));
        const roles = userLogin.roles?.map((e) => e.id);
        const roleOptions = userLogin.roles?.map((e) => ({
          value: e.id,
          label: e.name,
        }));
        set(() => ({
          userLogin: { ...userLogin, groups, groupOptions, roles, roleOptions },
        }));
      },

      openChangePassword: false,
      setOpenChangePassword(openChangePassword) {
        set(() => ({ openChangePassword }));
      },

      menuData: [],
      setMenuData(menuData) {
        set(() => ({ menuData }));
      },

      urlsActive: ['/'],
      setUrlsActive(urlsActive) {
        set(() => ({ urlsActive }));
      },
      params: {
        EXAMPLE: [],
        EXAMPLE2: [],
        EXAMPLE3: [],
      },
      setParams(params) {
        set(() => ({ params }));
      },

      setInitApp(data) {
        set(() => ({
          userLogin: data.profile,
          menuData: data.menus,
          params: data.params,
        }));
      },

      async logoutStore() {
        const refreshToken = StorageService.getRefreshToken(REFRESH_TOKEN_KEY);
        try {
          await layoutPageService.logout(refreshToken);
        } catch (e) {
          console.error('Logout failed', e);
        } finally {
          StorageService.removeToken(
            ACCESS_TOKEN_KEY,
            REFRESH_TOKEN_KEY,
            FCM_TOKEN_KEY,
            USERNAME
          );
          set(() => {
            return {
              collapsedMenu: false,
              showNotify: false,
              isAuthenticated: false,
              showChangePassModal: false,
              userLogin: null,
              openChangePassword: false,
              dataNotify: {
                data: [],
                totalNotSeen: 0,
              },
              menuData: [],
              urlsActive: ['/'],
              params: {
                EXAMPLE: [],
                EXAMPLE2: [],
                EXAMPLE3: [],
              },
            };
          });
        }
      },
    }),
    {
      name: `${STORAGE_KEY_PREFIX}${APP_CODE}:ConfigApp`,
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

mountStoreDevtool('Store', useConfigAppStore);

export default useConfigAppStore;
