import { axiosClient } from 'apps/Partner/src/service';
import { IFormUser, IOrganization, IRelationUser, IUserItem } from '../types';
import {
  prefixAuthServicePublic,
  prefixCatalogServicePublic,
} from 'apps/Partner/src/constants/app';
import { IUserParams } from 'apps/Partner/src/modules/UserManagement/types';
import { IPage } from '@react/commons/types';

export const userServices = {
  getUsers: (params: IUserParams) => {
    return axiosClient.get<IUserParams, IPage<IUserItem>>(
      `${prefixAuthServicePublic}/api/users`,
      {
        params,
      }
    );
  },
  updateUser: async (data: IFormUser) => {
    const { organizationIds, ...payload } = data;
    return await axiosClient.post<IUserItem>(
      `${prefixCatalogServicePublic}/organization-user/${payload.id}`,
      {
        userId: payload.id,
        organizationIds: organizationIds ?? [],
        username: payload.username,
        userFullName: payload.fullname,
        clientId: payload.clientId,
        status: payload.status,
        email: payload.email,
      }
    );
  },
  deleteUsers: async (ids: string[]) => {
    const params = new URLSearchParams();
    const paramsDelete = new URLSearchParams();
    ids.forEach((id) => {
      params.append('id', id);
      paramsDelete.append('userId', id);
    });
    const res = await axiosClient.delete(
      `${prefixAuthServicePublic}/api/users`,
      {
        params: params,
      }
    );
    await axiosClient.delete(
      `${prefixCatalogServicePublic}/organization-user`,
      {
        params: paramsDelete,
      }
    );
    return res.data;
  },
  getOrganization: async () => {
    return await axiosClient.get<string, IOrganization[]>(
      `${prefixCatalogServicePublic}/organization-unit`
    );
  },
  getUser: async (id: string): Promise<IUserItem> => {
    const user = await axiosClient.get<string, IUserItem>(
      `${prefixAuthServicePublic}/api/users/${id}`
    );
    const relationUser = await axiosClient.get<string, IRelationUser[]>(
      `${prefixCatalogServicePublic}/organization-user/data/${id}`
    );
    return {
      ...user,
      organizationIds: relationUser.map((item) => item.orgId),
      roleIds: user.roles.map((item) => item.id),
    };
  },
};
