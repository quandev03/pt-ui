import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import {
  prefixAuthServicePrivate,
  prefixCatalogService,
  prefixCatalogServicePublic,
} from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IAllGroupUser,
  IDepartment,
  IFormUser,
  IOrganization,
  IRelationUser,
  IUserItem,
  IUserParams,
} from '../types';

export const userServices = {
  getUsers: (params: IUserParams) => {
    return axiosClient.get<IUserParams, IPage<IUserItem>>(
      `${prefixAuthServicePrivate}/api/users/internal`,
      {
        params,
      }
    );
  },
  updateUser: async (data: IFormUser) => {
    const { organizationIds, ...payload } = data;
    const res = await axiosClient.put<IFormUser, IUserItem>(
      `${prefixAuthServicePrivate}/api/users/internal/${data.id}`,
      payload
    );
    await axiosClient.post<IUserItem>(
      `${prefixCatalogServicePublic}/organization-user/${res.id}`,
      {
        userId: res.id,
        organizationIds: organizationIds ?? [],
        username: res.username,
        userFullName: res.fullname,
        clientId: res.client.id,
        status: res.status,
        email: res.email,
      }
    );
    return res;
  },
  deleteUsers: async (id: string) => {
    const paramsDelete = new URLSearchParams();
    paramsDelete.append('userId', id);
    await axiosClient.delete(
      `${prefixCatalogServicePublic}/organization-user`,
      {
        params: paramsDelete,
      }
    );
    const res = await axiosClient.delete(
      `${prefixAuthServicePrivate}/api/users/internal/${id}`
    );

    return res.data;
  },
  createUser: async (data: IFormUser) => {
    const { organizationIds, ...payload } = data;
    const createUserRes = await axiosClient.post<IFormUser, IUserItem>(
      `${prefixAuthServicePrivate}/api/users/internal`,
      payload
    );
    await axiosClient.post<IUserItem>(
      `${prefixCatalogServicePublic}/organization-user/${createUserRes.id}`,
      {
        userId: createUserRes.id,
        organizationIds: organizationIds ?? [],
        username: createUserRes.username,
        userFullName: createUserRes.fullname,
        clientId: createUserRes.client.id,
        status: createUserRes.status,
        email: createUserRes.email,
      }
    );
    return createUserRes;
  },
  getOrganization: async () => {
    return await axiosClient.get<any, IOrganization[]>(
      `${prefixCatalogService}/organization-unit`
    );
  },
  getUser: async (id: string) => {
    const res = await axiosClient.get<string, IUserItem>(
      `${prefixAuthServicePrivate}/api/users/internal/${id}`
    );
    const relationUser = await userServices.getRelationUser(id);
    return {
      ...res,
      organizationIds: (relationUser ?? []).map((item) => item.orgId),
      loginMethod: String(res.loginMethod),
    } as IUserItem;
  },
  getRelationUser: async (id: string) => {
    try {
      return await axiosClient.get<string, IRelationUser[]>(
        `${prefixCatalogServicePublic}/organization-user/data/${id}`
      );
    } catch {
      return [];
    }
  },
  getAllGroupUsers: async () => {
    try {
      return await axiosClient.get<string, IAllGroupUser[]>(
        `${prefixAuthServicePrivate}/api/groups/internal/all`
      );
    } catch {
      return [];
    }
  },
  getAllDepartment: async () => {
    try {
      return await axiosClient.get<string, IDepartment[]>(
        `${prefixAuthServicePrivate}/api/departments/all`
      );
    } catch {
      return [];
    }
  },
  checkDeleteUser: async (id: string) => {
    return await axiosClient.get<string, { isDeleteThisUser: boolean }>(
      `${prefixCustomerService}/sale-employee/check-role-for-admin?userId=${id}`
    );
  },
};
