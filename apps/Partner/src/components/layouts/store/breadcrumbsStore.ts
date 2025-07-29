import { create } from 'zustand';
import { ItemType as BreadcrumbType } from 'antd/lib/breadcrumb/Breadcrumb';

export interface IGroupStore {
  breadcrumbs: BreadcrumbType[];
  setBreadcrumbs: (value: BreadcrumbType[]) => void;
}

const useBreadcrumbsStore = create<IGroupStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs(value) {
    set(() => ({ breadcrumbs: value }));
  },
}));
export default useBreadcrumbsStore;
