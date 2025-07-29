import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { Res, ParameterConfigService } from '../services';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { ICategoryParameterConfig } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

export const PARAMETER_CONFIG_QUERY_KEY = {
  LIST: 'query-list-parameter-config',
  DETAIL: 'query-detail-parameter-config',
};

export const useListParameterConfig = (body: any) => {
  return useQuery({
    queryFn: () => ParameterConfigService.getList(body),
    queryKey: [PARAMETER_CONFIG_QUERY_KEY.LIST, body],
    select: (data: Res) => data,
    enabled: true,
  });
};

export const useAddParameterConfig = (
  onSuccess: () => void,
  form: FormInstance<any>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ParameterConfigService.add,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [PARAMETER_CONFIG_QUERY_KEY.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_PARAMS],
      });

      onSuccess();
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field,
            errors: [item.detail],
          }))
        );
      }
    },
  });
};

export const useGetDetailParameterConfig = (id: string) => {
  return useQuery({
    queryKey: [PARAMETER_CONFIG_QUERY_KEY.DETAIL, id],
    queryFn: () => ParameterConfigService.detail(id),
    select: (data: ICategoryParameterConfig) => data,
    enabled: !!id,
  });
};

export function useDeleteParameterConfig(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ParameterConfigService.delete,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G03);
      queryClient.invalidateQueries({
        queryKey: [PARAMETER_CONFIG_QUERY_KEY.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_PARAMS],
      });
      onSuccess && onSuccess();
    },
  });
}

export function useUpdateParameterConfig(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ParameterConfigService.update,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [PARAMETER_CONFIG_QUERY_KEY.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_PARAMS],
      });
      onSuccess();
    },
  });
}
