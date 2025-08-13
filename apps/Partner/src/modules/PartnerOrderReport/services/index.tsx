import { IPage } from '@vissoft-react/common';
import { safeApiClient } from '../../../../src/services';
import { IPartnerOrderReport, IPartnerParams } from '../type';
import { prefixSaleService } from '../../../../src/constants';

export const partnerOrderReportServices = {
  getListPartnerOrderReport: async (params: IPartnerParams) => {
    return safeApiClient.get<IPage<IPartnerOrderReport>>(
      `${prefixSaleService}/revenue-statistic/order`,
      {
        params,
      }
    );
  },
  exportReport: async (params: IPartnerParams) => {
    const apiParams = {
      q: params.q,
      startDate: params.startDate,
      endDate: params.endDate,
      orgCode: params.orgCode,
    };

    const res = await safeApiClient.post<Blob>(
      `${prefixSaleService}/revenue-statistic/order/export-excel`,
      null,
      {
        params: apiParams,
        responseType: 'blob',
      }
    );
    if (!res || !res || res.size === 0) {
      throw new Error(
        'Không có dữ liệu để xuất báo cáo. Vui lòng kiểm tra lại bộ lọc.'
      );
    }
    return res;
  },
};
