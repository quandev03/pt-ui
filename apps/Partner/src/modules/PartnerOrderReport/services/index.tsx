import { AnyElement, IPage, IParamsRequest } from '@vissoft-react/common';
import { safeApiClient } from '../../../../src/services';
import { IPartnerOrderReport } from '../type';
import { prefixSaleService } from '../../../../src/constants';

export const partnerOrderReportServices = {
  getListPartnerOrderReport: async (params: IParamsRequest) => {
    return safeApiClient.get<IPage<IPartnerOrderReport>>(
      `${prefixSaleService}/revenue-statistic/order`,
      {
        params,
      }
    );
  },
  exportReport: async () => {
    const res = await safeApiClient.get<AnyElement>(
      `${prefixSaleService}/revenue-statistic/order/export-excel`,
      {
        responseType: 'blob',
      }
    );
    return res.data;
  },
};
