import { IPage } from '@react/commons/types';
import {
  ContentItem,
  PayloadCreateUpdateGroup,
  UserItem,
  RoleItem,
} from '../types';
import { urlRoles, urlUserName } from './url';
import { axiosClient } from "apps/Internal/src/service";

export const groupUserServices = {
  getListUserName: async () => {
    const res = await axiosClient.get<IPage<UserItem>>(urlUserName, {
      params: {
        page: 0,
        size: 9999,
      }
    });
    if (!res || !res.data) throw new Error('Opps');
    return res.data?.content || [];
  },
  getListRoles: async () => {
    const res = await axiosClient.get<IPage<RoleItem>>(urlRoles, {
      params: {
        page: 0,
        size: 9999,
      }
    });
    if (!res || !res.data) throw new Error('Opps');
    return res.data?.content || [];
  },
  postAddUserGroup: async (params: PayloadCreateUpdateGroup) => {
    const res = await axiosClient.post<ContentItem>('/api/groups', params);
    if (!res || !res.data) throw new Error('Opps');
    return res.data;
  },
  putAddUserGroup: async (params: PayloadCreateUpdateGroup) => {
    const res = await axiosClient.put<ContentItem>(
      `/api/groups/${params.id}`,
      params
    );
    if (!res || !res.data) throw new Error('Opps');
    return res.data;
  },
  deleteAddUserGroup: async (ids: string[]) => {
    const params = new URLSearchParams();
    for (const id of ids) {
      params.append('id', id);
    }
    const res = await axiosClient.delete('/api/groups', {
      params: params,
    });
    return res.data;
  },
};
