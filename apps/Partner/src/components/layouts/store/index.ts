import { LayoutService } from 'apps/Partner/src/components/layouts/services';
import { APP_CODE, STORAGE_KEY_PREFIX } from 'apps/Partner/src/constants';
import StorageService from 'apps/Partner/src/helpers/storageService';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import useConfigAppNoPersistStore from './useConfigAppNoPersistStore';

export interface IConfigAppStore {
  collapsedMenu: boolean;
  showNotify: boolean;
  isAuthenticated: boolean;
  showChangePassModal: boolean;

  toggleCollapsedMenu: () => void;
  setIsAuthenticated: (open: boolean) => void;
  setShowNotify: (open: boolean) => void;
  setShowChangePassModal: (open: boolean) => void;
  logoutStore: () => void;
}

const useConfigAppStore = create(
  persist<IConfigAppStore>(
    (set, getState) => ({
      collapsedMenu: false,
      showNotify: false,
      isAuthenticated: false,
      showChangePassModal: false,
      urlsActive: [],
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
      logoutStore() {
        const refreshToken = StorageService.getRefreshToken();
        LayoutService.logout(refreshToken)
          .then(() => {
            console.info('Revoke refresh token success!');
          })
          .catch((e) => {
            console.error('Revoke refresh token failed!', e);
          })
          .finally(() => {
            console.log('Revoke refresh token finished!');
            StorageService.removeToken();
            useConfigAppNoPersistStore.getState().logout();
            set(() => {
              return {
                collapsedMenu: false,
                showNotify: false,
                isAuthenticated: false,
                showChangePassModal: false,
              };
            });
          });
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
