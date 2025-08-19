import { useMutation, useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { reportPartnerServices } from '../services';
import { IReportPartnerItem, IReportPartnerParams } from '../types';

export const useGetAllReportPartner = (params: IReportPartnerParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_REPORT_PARTNER, params],
    queryFn: () => reportPartnerServices.getAllReportPartner(params),
  });
};

export const useGetDetailReportPartner = (
  onSuccess: (data: IReportPartnerItem) => void
) => {
  return useMutation({
    mutationFn: reportPartnerServices.getDetailReportPartner,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
