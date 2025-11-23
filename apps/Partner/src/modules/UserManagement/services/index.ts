import { prefixAuthService } from '../../../../src/constants';
import { safeApiClient } from '../../../services/axios';
import {
  IFormUser,
  IRoleItem,
  IUserItem,
  IUserParams,
  IUpdateOrganizationUserRequest,
} from '../types';
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
    const { orgId, ...payload } = data;
    const createUserRes = await safeApiClient.post<IUserItem>(
      `${prefixAuthService}/api/users/partner/${orgId}`,
      payload
    );
    return createUserRes;
  },
  updateUser: async (data: IFormUser) => {
    const res = await safeApiClient.put<IUserItem>(
      `${prefixAuthService}/api/users/partner/${data.id}`,
      data
    );
    
    // Call additional API to update organization-user
    if (data.orgId && data.id && data.email) {
      try {
        await safeApiClient.put<void>(
          `/sale-service/public/api/v1/organization-user`,
          {
            orgId: data.orgId,
            userId: data.id,
            userName: data.username,
            userFullname: data.fullname,
            email: data.email,
            status: data.status,
            isCurrent: 1,
          }
        );
      } catch (error) {
        // Log error but don't fail the main update
        console.error('Failed to update organization-user:', error);
      }
    }
    
    return res;
  },
  updateOrganizationUser: async (
    data: IUpdateOrganizationUserRequest
  ) => {
    return await safeApiClient.put<void>(
      `/sale-service/public/api/v1/organization-user`,
      data
    );
  },
};
