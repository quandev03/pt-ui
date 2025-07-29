import { AnyElement, IPage } from '@react/commons/types';
import { IFullMenu, IObjectItem, IRoleItem, IRoleParams } from '../types';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';

export const RoleService = {
  getRoles: (payload: IRoleParams) => {
    const { isPartner, ...params } = payload;
    return axiosClient.get<string, IPage<any>>(
      `${prefixAuthServicePrivate}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }`,
      {
        params,
      }
    );
  },
  createRole: async (payload: IObjectItem) => {
    const { isPartner, ...data } = payload;
    return await axiosClient.post<any, IRoleItem>(
      `${prefixAuthServicePrivate}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }`,
      data
    );
  },
  deleteRoleApi: async ({
    id,
    isPartner,
  }: {
    isPartner: boolean;
    id: string;
  }) => {
    return await axiosClient.delete(
      `${prefixAuthServicePrivate}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }/${id}`
    );
  },
  getListObject: async (isPartner: boolean) => {
    return await axiosClient.get<any, IFullMenu[]>(
      `${prefixAuthServicePrivate}/api/objects`,
      { params: { isPartner, isMobile: false } }
    );
  },
  getListObjectMobile: async (isPartner: boolean) => {
    return await axiosClient.get<any, IFullMenu[]>(
      `${prefixAuthServicePrivate}/api/objects`,
      { params: { isPartner, isMobile: true } }
    );
  },
  updateRoleById: async (payload: IRoleItem) => {
    const { isPartner, ...data } = payload;
    return await axiosClient.put<any, AnyElement>(
      `${prefixAuthServicePrivate}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }/${data.id}`,
      data
    );
  },
  getDetailRoleById: async ({
    id,
    isPartner,
  }: {
    id?: string;
    isPartner: boolean;
  }) => {
    return await axiosClient.get<any, IRoleItem>(
      `${prefixAuthServicePrivate}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }/${id}`
    );
  },
};
