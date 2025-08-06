import { prefixSaleService } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import { IAgency, IAgencyParams, IFormAgency } from '../types';

export const agencyListService = {
  getAgencies: (params: IAgencyParams) => {
    return safeApiClient.get<IAgency[]>(
      `${prefixSaleService}/organization-unit`,
      {
        params,
      }
    );
  },
  getAgency: async (id: string) => {
    const res = await safeApiClient.get<IAgency>(
      `${prefixSaleService}/organization-unit/${id}`
    );
    return res;
  },
  createAgency: async (data: IFormAgency) => {
    const createAgencyRes = await safeApiClient.post<IAgency>(
      `${prefixSaleService}/organization-unit`,
      data
    );
    return createAgencyRes;
  },
  updateAgency: async (data: IFormAgency) => {
    const res = await safeApiClient.put<IAgency>(
      `${prefixSaleService}/organization-unit/${data.id}`,
      data
    );
    return res;
  },
  deleteAgencys: async (id: string) => {
    const res = await safeApiClient.delete(
      `${prefixSaleService}/organization-unit/${id}`
    );
    return res;
  },
};
