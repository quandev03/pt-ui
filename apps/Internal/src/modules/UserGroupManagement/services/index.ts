import { safeApiClient } from 'apps/Internal/src/services';
import {
  IGroupUserParams,
  IUserGroup,
  PayloadCreateUpdateGroup,
} from '../types';
import { IPage } from '@vissoft-react/common';
import { prefixAuthService } from 'apps/Internal/src/constants';

export const groupUserServices = {
  getGroupUsers: (params: IGroupUserParams) => {
    return safeApiClient.get<IPage<IUserGroup>>(
      `${prefixAuthService}/api/groups/internal`,
      {
        params,
      }
    );
  },
  postAddUserGroup: async (params: PayloadCreateUpdateGroup) => {
    const res = await safeApiClient.post<IUserGroup>(
      `${prefixAuthService}/api/groups/internal`,
      params
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  putAddUserGroup: async (params: PayloadCreateUpdateGroup) => {
    const res = await safeApiClient.put<IUserGroup>(
      `${prefixAuthService}/api/groups/internal/${params.id}`,
      params
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  deleteAddUserGroup: async (id: string) => {
    const res = await safeApiClient.delete(
      `${prefixAuthService}/api/groups/internal/${id}`
    );
    return res;
  },
  getGroupUser: async (id: string) => {
    const res = await safeApiClient.get<IUserGroup>(
      `${prefixAuthService}/api/groups/internal/${id}`
    );
    return res;
  },
};
