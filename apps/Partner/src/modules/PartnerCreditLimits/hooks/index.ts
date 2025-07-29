import { useMutation, useQuery } from '@tanstack/react-query';
import { PartnerCreditLimitsServices } from '../services';
import {
  IPartnerCreditLimitsList,
  IPartnerLimitsHistoryParams
} from '../type';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';

export const useGetListPartnerLimitsDebtHistory = (
  params: IPartnerLimitsHistoryParams
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PARTNER_LIMITS_DEBT_HISTORY, params],
    enabled: !!params,
    queryFn: () =>
      PartnerCreditLimitsServices.getListPartnerDebtLimitsHistory(params),
  });
};

export const useSupportGetPartnerLimitsId = (
  onSuccess: (data: IPartnerCreditLimitsList) => void
) => {
  return useMutation({
    mutationFn: PartnerCreditLimitsServices.getListPartnerLimitsId,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};

