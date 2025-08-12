import { useQuery } from '@tanstack/react-query';
import { IParamsRequest } from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { partnerOrderReportServices } from '../services';

export const useListPartnerOrder = (params: IParamsRequest) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PARTNER_ORDER_REPORT_LIST],
    queryFn: () => partnerOrderReportServices.getListPartnerOrderReport(params),
  });
};
