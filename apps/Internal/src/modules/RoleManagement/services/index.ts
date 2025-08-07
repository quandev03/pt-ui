import { AnyElement, IPage } from '@vissoft-react/common';
import { IFullMenu, IObjectItem, IRoleItem, IRoleParams } from '../types';
import { prefixAuthService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';

export const RoleService = {
  getRoles: (payload: IRoleParams) => {
    const { isPartner, ...params } = payload;
    return safeApiClient.get<IPage<any>>(
      `${prefixAuthService}/api/roles/${isPartner ? 'partner' : 'internal'}`,
      {
        params,
      }
    );
  },
  createRole: async (payload: IObjectItem) => {
    const { isPartner, ...data } = payload;
    return await safeApiClient.post<IRoleItem>(
      `${prefixAuthService}/api/roles/${isPartner ? 'partner' : 'internal'}`,
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
    return await safeApiClient.delete(
      `${prefixAuthService}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }/${id}`
    );
  },
  getListObject: async (isPartner: boolean) => {
    return await safeApiClient.get<IFullMenu[]>(
      `${prefixAuthService}/api/objects`,
      { params: { isPartner, isMobile: false } }
    );
  },
  getListObjectMobile: async (isPartner: boolean) => {
    return await safeApiClient.get<IFullMenu[]>(
      `${prefixAuthService}/api/objects`,
      { params: { isPartner, isMobile: true } }
    );
  },
  updateRoleById: async (payload: IRoleItem) => {
    const { isPartner, ...data } = payload;
    return await safeApiClient.put<AnyElement>(
      `${prefixAuthService}/api/roles/${isPartner ? 'partner' : 'internal'}/${
        data.id
      }`,
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
    return await safeApiClient.get<IRoleItem>(
      `${prefixAuthService}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }/${id}`
    );
  },
};
