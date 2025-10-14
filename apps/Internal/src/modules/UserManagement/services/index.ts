import { AnyElement, IPage } from '@vissoft-react/common';
import { prefixAuthService } from '../../../constants';
import { axiosClient, safeApiClient } from '../../../services/axios';
import { IRoleItem } from '../../../types/admin';
import {
  IAllGroupUser,
  IFormUser,
  IOrganization,
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
    return res;
  },
  deleteUsers: async (id: string) => {
    const paramsDelete = new URLSearchParams();
    paramsDelete.append('userId', id);
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
    return createUserRes;
  },
  getUser: async (id: string) => {
    const res = await safeApiClient.get<IUserItem>(
      `${prefixAuthService}/api/users/internal/${id}`
    );
    return {
      ...res,
      loginMethod: String(res.loginMethod),
    } as IUserItem;
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
      const data = await axiosClient.get<AnyElement>(
        `${prefixAuthService}/api/departments/all`
      );
      return data.data;
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