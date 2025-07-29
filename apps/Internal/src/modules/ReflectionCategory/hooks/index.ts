import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { ReflectionCategoryService } from '../services';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { IPriorityItem, IReflectionCategory } from '../types';



export const REFLECTION_CATEGORY_QUERY_KEY = {
  LIST: 'query-list-reflection-category',
  DETAIL: 'query-detail-reflection-category',
  PRIORITY: 'query-priority',
};

export const useListReflectionCategory = (body: any) => {
  return useQuery({
    queryFn: () => ReflectionCategoryService.getList(body),
    queryKey: [REFLECTION_CATEGORY_QUERY_KEY.LIST, body],
    enabled: true,
  });
};

export const useAddReflectionCategory = (
  onSuccess: () => void,
  form: FormInstance<any>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ReflectionCategoryService.add,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [REFLECTION_CATEGORY_QUERY_KEY.LIST],
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

export const useGetDetailReflectionCategory = (id: string) => {
  return useQuery({
    queryKey: [REFLECTION_CATEGORY_QUERY_KEY.DETAIL, id],
    queryFn: () => ReflectionCategoryService.detail(id),
    select: (data: IReflectionCategory) => data,
    enabled: !!id,
  });
};

export function useDeleteReflectionCategory(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ReflectionCategoryService.delete,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G03);
      queryClient.invalidateQueries({
        queryKey: [REFLECTION_CATEGORY_QUERY_KEY.LIST],
      });
      onSuccess && onSuccess();
    },
  });
}

export function useUpdateReflectionCategory(
  onSuccess: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ReflectionCategoryService.update,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [REFLECTION_CATEGORY_QUERY_KEY.LIST],
      });
      onSuccess();
    },
  });
}

export const useGetPriority = () => {
  return useQuery({
    queryKey: [REFLECTION_CATEGORY_QUERY_KEY.PRIORITY],
    queryFn: ReflectionCategoryService.getPriority,
    select: (data) => {
      const result: {
        value: string;
        label: string;
      }[] = [];
      data.forEach((item: IPriorityItem) => {
        result.push({
          value: item.code,
          label: item.name,
        });
      });
      const res = result.sort((a, b) => (a.label > b.label ? 1 : -1));
      return res;
    },
  });
};