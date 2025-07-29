import { create } from 'zustand';
import { ItemType as BreadcrumbType } from 'antd/lib/breadcrumb/Breadcrumb';
import { MenuItem } from '@react/commons/types';

export interface IGroupStore {
  breadcrumbs: BreadcrumbType[];
  setBreadcrumbs: (value: BreadcrumbType[]) => void;
  breadcrumbsParams: Record<string, string>;
  setBreadcrumbsParams: (payload: Record<string, string>) => void;
  urlsActive: string[];
  setUrlsActive: (urls: string[]) => void;
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;
  logout: () => void;
}

const useConfigAppNoPersistStore = create<IGroupStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs(value) {
    set(() => ({ breadcrumbs: value }));
  },
  breadcrumbsParams: {},
  setBreadcrumbsParams(breadcrumbsParams) {
    set(() => ({ breadcrumbsParams }));
  },
  urlsActive: [],
  setUrlsActive(urls) {
    set(() => ({ urlsActive: urls }));
  },

  menus: [],
  setMenus(menus) {
    set(() => ({ menus }));
  },
  logout() {
    set(() => ({ menus: [], urlsActive: [], breadcrumbs: [] }));
  },
}));
export default useConfigAppNoPersistStore;
