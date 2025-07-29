import { IModeAction } from '@react/commons/types';
import { create } from 'zustand';
import { ContentItem, UserItem, RoleItem } from '../types';

const groupDefault = {
  code: '',
  createdBy: '',
  createdDate: '',
  id: '',
  lastModifiedBy: '',
  lastModifiedDate: '',
  name: '',
  roleIds: [],
  status: 1,
  userIds: [],
  roles: [],
  users: [],
};

export interface IGroupStore {
  groupDetail: ContentItem;
  idGroupDetail: string;
  listRole: RoleItem[];
  listRoleStatus0: RoleItem[];
  listUser: UserItem[];
  listUserStatus0: UserItem[];
  isValuesChanged: boolean;
  saveForm: boolean;

  setIsValuesChanged: (isChanged: boolean) => void;
  setIdGroupDetail: (id: string) => void;
  setGroupDetail: (item: ContentItem) => void;
  setListUserStatus0: (list: UserItem[]) => void;
  setListRoleStatus0: (list: RoleItem[]) => void;
  resetGroupStore: () => void;
  setSaveForm: () => void;
}

const useGroupStore = create<IGroupStore>((set) => ({
  groupDetail: groupDefault,
  idGroupDetail: '',
  listRole: [],
  listRoleStatus0: [],
  listUser: [],
  listUserStatus0: [],
  isValuesChanged: false,
  saveForm: false,

  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },
  setIdGroupDetail(id) {
    set(() => ({ idGroupDetail: id }));
  },
  setGroupDetail(item) {
    set(() => ({ groupDetail: item }));
  },
  setListUserStatus0(changed) {
    set(() => ({ listUserStatus0: changed }));
  },
  setListRoleStatus0(changed) {
    set(() => ({ listRoleStatus0: changed }));
  },
  resetGroupStore() {
    set(() => ({
      groupDetail: groupDefault,
      isValuesChanged: false,
      idGroupDetail: '',
      listRole: [],
      listRoleStatus0: [],
      listUser: [],
      listUserStatus0: [],
    }));
  },
  setSaveForm() {
    set((state: IGroupStore) => ({ saveForm: !state.saveForm }));
  },
}));
export default useGroupStore;
