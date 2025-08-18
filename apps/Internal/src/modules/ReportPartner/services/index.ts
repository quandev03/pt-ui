import { IPage } from '@vissoft-react/common';
import { prefixAuthService } from '../../../constants';
import { safeApiClient } from '../../../services/axios';
import { IReportPartnerItem, IReportPartnerParams } from '../types';

export const reportPartnerServices = {
  getAllReportPartner: (params: IReportPartnerParams) => {
    return safeApiClient.get<IPage<IReportPartnerItem>>(
      `${prefixAuthService}/api/users/internal`,
      {
        params,
      }
    );
  },

  getDetailReportPartner: async (id: string) => {
    return await safeApiClient.get<IReportPartnerItem>(
      `${prefixAuthService}/api/users/internal/${id}`
    );
  },
};
