import { prefixAuthService } from '../../../../src/constants';
import { safeApiClient } from '../../../services/axios';
import { IUserItem, IUserParams } from '../types';
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
};
