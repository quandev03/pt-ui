import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { PartnerCreditLimitsServices } from '../services';
import {
  IPartnerCreditLimitsList,
  IPartnerCreditLimitsParams,
  IPartnerLimitsHistoryParams,
} from '../type';

export const useGetListPartnerCreditLimits = (
  params: IPartnerCreditLimitsParams
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PartnerCreditLimits, params],
    queryFn: () =>
      PartnerCreditLimitsServices.getListPartnerCreditLimits(params),
  });
};

export const useGetPartnerWithoutLimits = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.getPartnerNoLimit],
    queryFn: () => PartnerCreditLimitsServices.getPartnerWithoutLimit(),
  });
};

export const useGetListPartnerLimitsHistory = (
  params: IPartnerLimitsHistoryParams
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GetListPartnerLimitsHistory, params],
    enabled: !!params.id,
    queryFn: () =>
      PartnerCreditLimitsServices.getListPartnerLimitsHistory(params),
  });
};

export const useGetListPartnerLimitsDebtHistory = (
  params: IPartnerLimitsHistoryParams
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GetListPartnerLimitsHistory, params],
    enabled: !!params.id,
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

export const useSupportCreateListPartnerLimits = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PartnerCreditLimitsServices.createListPartnerCreditLimits,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PartnerCreditLimits],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};

export const useSupportCreateDebtAdjustment = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PartnerCreditLimitsServices.createDebtAdjustment,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PartnerCreditLimits],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};

export const useSupportCreatePartnerCreditLimits = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PartnerCreditLimitsServices.createListPartnerCreditLimits,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PartnerCreditLimits],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};

export const useSupportPutPartnerCreditLimits = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PartnerCreditLimitsServices.putListPartnerCreditLimits,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PartnerCreditLimits],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};
