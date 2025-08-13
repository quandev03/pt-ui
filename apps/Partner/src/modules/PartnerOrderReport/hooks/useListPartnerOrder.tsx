import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { partnerOrderReportServices } from '../services';
import { IPartnerParams } from '../type';

export const useListPartnerOrder = (params: IPartnerParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PARTNER_ORDER_REPORT_LIST, params],
    queryFn: () => partnerOrderReportServices.getListPartnerOrderReport(params),
  });
};
