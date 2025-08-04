import { IPage } from '@vissoft-react/common';
import { prefixAuthService } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import { IAgency, IAgencyParams, IFormAgency } from '../types';

export const agencyListService = {
  getAgencies: (params: IAgencyParams) => {
    return safeApiClient.get<IPage<IAgency>>(
      `${prefixAuthService}/api/agency`,
      {
        params,
      }
    );
  },
  getAgency: async (id: string) => {
    const res = await safeApiClient.get<IAgency>(
      `${prefixAuthService}/api/agency/${id}`
    );
    return res;
  },
  createAgency: async (data: IFormAgency) => {
    const createAgencyRes = await safeApiClient.post<IAgency>(
      `${prefixAuthService}/api/agency`,
      data
    );
    return createAgencyRes;
  },
  updateAgency: async (data: IFormAgency) => {
    const res = await safeApiClient.put<IAgency>(
      `${prefixAuthService}/api/agency/${data.id}`,
      data
    );
    return res;
  },
  deleteAgencys: async (id: string) => {
    const res = await safeApiClient.delete(
      `${prefixAuthService}/api/agency/${id}`
    );
    return res;
  },
};
