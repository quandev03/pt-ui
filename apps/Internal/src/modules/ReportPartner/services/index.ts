import { IPage } from '@vissoft-react/common';
import { prefixAuthService } from '../../../constants';
import { safeApiClient } from '../../../services/axios';
import { IReportPartnerItem, IReportPartnerParams } from '../types';

export const reportPartnerServices = {
  getAllReportPartner: (params: IReportPartnerParams) => {
    return safeApiClient.get<IPage<IReportPartnerItem>>(
      `${prefixAuthService}/api/orders-report`,
      {
        params,
      }
    );
  },
};
