import { IPage } from '@vissoft-react/common';
import { prefixAuthService } from '../../../constants';
import { axiosClient, safeApiClient } from '../../../services/axios';
import { IRoleItem } from '../../../types/admin';
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
    return safeApiClient.get<IPage<IUserItem>>(
      `${prefixAuthService}/api/users/internal`,
      {
        params,
      }
    );
  },
  getAllRoles: async ({ isPartner }: { isPartner: boolean }) => {
    const res = await axiosClient.get<IRoleItem[]>(
      `${prefixAuthService}/api/roles/${isPartner ? 'partner' : 'internal'}/all`
    );
    if (!res) throw new Error('Oops');
    return res.data;
  },
  updateUser: async (data: IFormUser) => {
    const { organizationIds, ...payload } = data;
    const res = await safeApiClient.put<IUserItem>(
      `${prefixAuthService}/api/users/internal/${data.id}`,
      payload
    );
    await safeApiClient.post<IUserItem>(
      `${prefixAuthService}/api/organization-user/${res.id}`,
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
    await safeApiClient.delete(`${prefixAuthService}/organization-user`, {
      params: paramsDelete,
    });
    const res = await safeApiClient.delete(
      `${prefixAuthService}/api/users/internal/${id}`
    );

    return res;
  },
  createUser: async (data: IFormUser) => {
    const { organizationIds, ...payload } = data;
    const createUserRes = await safeApiClient.post<IUserItem>(
      `${prefixAuthService}/api/users/internal`,
      payload
    );
    // await safeApiClient.post<IUserItem>(
    //   `${prefixCatalogServicePublic}/organization-user/${createUserRes.id}`,
    //   {
    //     userId: createUserRes.id,
    //     organizationIds: organizationIds ?? [],
    //     username: createUserRes.username,
    //     userFullName: createUserRes.fullname,
    //     clientId: createUserRes.client.id,
    //     status: createUserRes.status,
    //     email: createUserRes.email,
    //   }
    // );
    return createUserRes;
  },
  // getOrganization: async () => {
  //   return await axiosClient.get<any, IOrganization[]>(
  //     `${prefixCatalogService}/organization-unit`
  //   );
  // },
  getUser: async (id: string) => {
    const res = await safeApiClient.get<IUserItem>(
      `${prefixAuthService}/api/users/internal/${id}`
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
      return await safeApiClient.get<IRelationUser[]>(
        `${prefixAuthService}/api/organization-user/data/${id}`
      );
    } catch {
      return [];
    }
  },
  getAllGroupUsers: async () => {
    try {
      return await safeApiClient.get<IAllGroupUser[]>(
        `${prefixAuthService}/api/groups/internal/all`
      );
    } catch {
      return [];
    }
  },
  getAllDepartment: async () => {
    try {
      return await axiosClient.get<string, IDepartment[]>(
        `${prefixAuthService}/api/departments/all`
      );
    } catch {
      return [];
    }
  },
  checkDeleteUser: async (id: string) => {
    return await axiosClient.get<string, { isDeleteThisUser: boolean }>(
      `${prefixAuthService}/api/sale-employee/check-role-for-admin?userId=${id}`
    );
  },
  getListOrgUnit: async (params: { status: number }) => {
    const res = await axiosClient.get<IOrganization[]>(
      `${prefixAuthService}/api/organization-unit`,
      { params }
    );
    if (!res) throw new Error('Oops');
    return res.data;
  },
};
