import { prefixAuthService } from '../../../../src/constants';
import { safeApiClient } from '../../../services/axios';
import { IFormUser, IRoleItem, IUserItem, IUserParams } from '../types';
import { IPage } from '@vissoft-react/common';

export const userServices = {
  getUsers: (params: IUserParams) => {
    return safeApiClient.get<IPage<IUserItem>>(
      `${prefixAuthService}/api/users`,
      {
        params,
      }
    );
  },
  getUser: async (id: string) => {
    const res = await safeApiClient.get<IUserItem>(
      `${prefixAuthService}/api/users/${id}`
    );
    return res;
  },
  getAllRoles: async () => {
    const res = await safeApiClient.get<IRoleItem[]>(
      `${prefixAuthService}/api/roles/all`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  deleteUsers: async (id: string) => {
    const paramsDelete = new URLSearchParams();
    paramsDelete.append('userId', id);
    await safeApiClient.delete(`${prefixAuthService}/organization-user`, {
      params: paramsDelete,
    });
    const res = await safeApiClient.delete(
      `${prefixAuthService}/api/users/${id}`
    );
    return res;
  },
  createUser: async (data: IFormUser) => {
    const { organizationIds, ...payload } = data;
    const createUserRes = await safeApiClient.post<IUserItem>(
      `${prefixAuthService}/api/users`,
      payload
    );
    return createUserRes;
  },
  updateUser: async (data: IFormUser) => {
    const { organizationIds, ...payload } = data;
    const res = await safeApiClient.put<IUserItem>(
      `${prefixAuthService}/api/users/${data.id}`,
      payload
    );
    return res;
  },
};
