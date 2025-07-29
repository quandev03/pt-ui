import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryProductService } from '../services';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { ICategoryProduct, ICategoryProductParams } from '../types';
import { MESSAGE } from '@react/utils/message';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { FormInstance } from 'antd';
export const useGetCategoryProductObjectList = (
  params: ICategoryProductParams
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_CATEGORY_PRODUCT, params],
    queryFn: () => categoryProductService.getListCategoryProducts(params),
    select: (data) => data,
  });
};
export const useGetListCategotyType = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_CATEGOTY_TYPE],
    queryFn: () => categoryProductService.getListCategotyType(),
    select: (data) => data,
  });
};
export const useSupportAddCategoryProduct = (
  onSuccess: () => void,
  form: FormInstance<any>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryProductService.postAddCategoryProduct,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_CATEGORY_PRODUCT],
      });
      onSuccess();
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        if (err.code === "CAT05500") {
          NotificationError(err.detail);
        }
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

export function useSupportUpdateCategoryProduct(
  onSuccess: () => void,
  form: FormInstance<any>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryProductService.putAddCategoryProduct,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_CATEGORY_PRODUCT],
      });
      onSuccess();
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        if (err.code === "CAT05500") {
          NotificationError(err.detail);
        }
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field,
            errors: [item.detail],
          }))
        );
      }
    },
  });
}
export const useGetDetailCategoryProduct = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_CATEGORY_PRODUCT, id],
    queryFn: () => categoryProductService.getCategoryProductsDetail(id),
    select: (data: ICategoryProduct) => data,
    enabled: !!id,
  });
};

export function useSupportDeleteCategoryProduct(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryProductService.deleteAddCategoryProduct,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G03);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_CATEGORY_PRODUCT],
      });
      onSuccess && onSuccess();
    },
    onError: (error: CommonError) => {
      NotificationError(error.detail);
    },
  });
}
