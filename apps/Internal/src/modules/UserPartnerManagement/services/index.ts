import { axiosClient } from 'apps/Internal/src/service';
import {
  ICreateUpdateUserData,
  IDeleteUserData,
  IFormUser,
  IOrganization,
  IRelationUser,
  IUserDetailData,
  IUserItem,
  IUserParams,
} from '../types';
import {
  prefixAuthServicePrivate,
  prefixCatalogService,
} from 'apps/Internal/src/constants/app';
import { prefixCatalogServicePublic } from '@react/url/app';
import { IPage } from '@react/commons/types';

export const userServices = {
  searchUsers: async (payload: IUserParams) => {
    const { partner, ...res } = payload;
    return await axiosClient.get<string, IPage<IRelationUser>>(
      `${prefixAuthServicePrivate}/api/users/partner/${partner}`,
      { params: res }
    );
  },
  getUsers: (params: IUserParams) => {
    return axiosClient.get<IUserParams, IPage<IUserItem>>(
      `${prefixAuthServicePrivate}/api/users/${params.partner}`,
      {
        params,
      }
    );
  },
  updateUser: async (data: ICreateUpdateUserData) => {
    const { unit, ...payload } = data.user;
    const res = await axiosClient.put<IFormUser, IUserItem>(
      `${prefixAuthServicePrivate}/api/users/partner/${data.clientIdentity}/${data.id}`,
      payload
    );
    await axiosClient.post<IUserItem>(
      `${prefixCatalogServicePublic}/organization-user/${res.id}`,
      {
        userId: res.id,
        organizationIds: payload.organizationIds,
        username: res.username,
        userFullName: res.fullname,
        clientId: res.client.id,
        status: res.status,
        email: res.email,
      }
    );
    return res;
  },
  deleteUsers: async (data: IDeleteUserData) => {
    const paramsDelete = new URLSearchParams();
    paramsDelete.append('userId', data.id);

    const res = await axiosClient.delete(
      `${prefixAuthServicePrivate}/api/users/partner/${data.clientIdentity}/${data.id}`
    );
    await axiosClient.delete(
      `${prefixCatalogServicePublic}/organization-user`,
      {
        params: paramsDelete,
      }
    );
    return res.data;
  },
  createUser: async (data: ICreateUpdateUserData) => {
    const { ...payload } = data.user;
    const createUserRes = await axiosClient.post<IFormUser, IUserItem>(
      `${prefixAuthServicePrivate}/api/users/partner/${data.clientIdentity}`,
      payload
    );
    await axiosClient.post<IUserItem>(
      `${prefixCatalogServicePublic}/organization-user/${createUserRes.id}`,
      {
        userId: createUserRes.id,
        organizationIds: payload.organizationIds,
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
  getUser: async (data: IUserDetailData): Promise<IUserItem> => {
    const user = await axiosClient.get<string, IUserItem>(
      `${prefixAuthServicePrivate}/api/users/partner/${data.clientIdentity}/${data.id}`
    );
    const relationUser = await axiosClient.get<string, IRelationUser[]>(
      `${prefixCatalogServicePublic}/organization-user/data/${data.id}`
    );
    return {
      ...user,
      roleIds: user.roles.map((item) => item.id),
      organizationIds: relationUser.map((item) => item.orgId),
    };
  },
};
