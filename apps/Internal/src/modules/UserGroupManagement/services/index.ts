import { axiosClient } from 'apps/Internal/src/service';
import {
  IGroupUserParams,
  IUserGroup,
  PayloadCreateUpdateGroup,
} from '../types';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';
import { IPage } from '@react/commons/types';

export const groupUserServices = {
  getGroupUsers: (params: IGroupUserParams) => {
    return axiosClient.get<IGroupUserParams, IPage<IUserGroup>>(
      `${prefixAuthServicePrivate}/api/groups/internal`,
      {
        params,
      }
    );
  },
  postAddUserGroup: async (params: PayloadCreateUpdateGroup) => {
    const res = await axiosClient.post<PayloadCreateUpdateGroup, IUserGroup>(
      `${prefixAuthServicePrivate}/api/groups/internal`,
      params
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  putAddUserGroup: async (params: PayloadCreateUpdateGroup) => {
    const res = await axiosClient.put<PayloadCreateUpdateGroup, IUserGroup>(
      `${prefixAuthServicePrivate}/api/groups/internal/${params.id}`,
      params
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  deleteAddUserGroup: async (id: string) => {
    const res = await axiosClient.delete(
      `${prefixAuthServicePrivate}/api/groups/internal/${id}`
    );
    return res.data;
  },
  getGroupUser: async (id: string) => {
    const res = await axiosClient.get<string, IUserGroup>(
      `${prefixAuthServicePrivate}/api/groups/internal/${id}`
    );
    return res;
  },
};
