import { LayoutService } from 'apps/Internal/src/components/layouts/services';
import { APP_CODE, STORAGE_KEY_PREFIX } from 'apps/Internal/src/constants';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import StorageService from '../../../helpers/storageService';
import useConfigAppNoPersistStore from './useConfigAppNoPersistStore';

export interface IConfigAppStore {
  collapsedMenu: boolean;
  showNotify: boolean;
  isAuthenticated: boolean;
  showChangePassModal: boolean;
  openChangePassword: boolean;

  setOpenChangePassword: (openChangePassword: boolean) => void;
  toggleCollapsedMenu: () => void;
  setIsAuthenticated: (open: boolean) => void;
  setShowNotify: (open: boolean) => void;
  setShowChangePassModal: (open: boolean) => void;
  logoutStore: () => Promise<void>;
}

const useConfigAppStore = create(
  persist<IConfigAppStore>(
    (set, getState) => ({
      collapsedMenu: false,
      showNotify: false,
      isAuthenticated: false,
      showChangePassModal: false,
      openChangePassword: false,
      setOpenChangePassword(openChangePassword) {
        set(() => ({ openChangePassword }));
      },
      isLoadingMenu: false,
      toggleCollapsedMenu() {
        const state = getState();
        set(() => ({ collapsedMenu: !state.collapsedMenu }));
      },
      setIsAuthenticated(isLogined) {
        set(() => ({ isAuthenticated: isLogined }));
      },
      setShowNotify(open) {
        set(() => ({ showNotify: open }));
      },
      setShowChangePassModal(show) {
        set(() => ({ showChangePassModal: show }));
      },
      async logoutStore() {
        const refreshToken = StorageService.getRefreshToken();
        try {
          await LayoutService.logout(refreshToken);
        } catch (e) {
          console.error('Logout failed', e);
        } finally {
          StorageService.removeToken();
          useConfigAppNoPersistStore.getState().logout();
          set(() => {
            return {
              collapsedMenu: false,
              showNotify: false,
              isAuthenticated: false,
              showChangePassModal: false,
              openChangePassword: false,
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
