import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { PartnerCatalogService } from '../services';
import {
  ICCCDInfo,
  IOrganizationUnitDTO,
  IParamsProductByCategory,
  IPartnerCatalogParams,
  IStockNumberParams,
} from '../types';

export const useGetOrganizationPartner = (params: IPartnerCatalogParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PARTNER_CATALOG_LIST, params],
    queryFn: () => PartnerCatalogService.getOrganizationPartner(params),
  });
};

export const useGetStockNumber = (
  params: IStockNumberParams,
  isCall: boolean
) => {
  return useQuery({
    queryKey: ['useGetStockNumber', params],
    queryFn: () => PartnerCatalogService.getStockNumber(params),
    enabled: isCall,
  });
};

export const useInfinityProductByCategory = (
  params: IParamsProductByCategory
) => {
  return useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.PARTNER_CATALOG_LIST_INFINITY, params],
    initialPageParam: 0,
    enabled: !!params.categoryId,
    queryFn: ({ pageParam }) => {
      return PartnerCatalogService.getProductByCategory({
        ...params,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    select: (data) => {
      const result = data.pages.flatMap((page) => page.content);
      return result;
    },
  });
};

export const useGetProductAuthorization = (id: string | number) => {
  return useQuery({
    queryKey: ['useGetProductAuthorization', id],
    enabled: !!id,
    queryFn: () => PartnerCatalogService.getProductAuthorization(id),
  });
};

export const useGetStockPermission = (
  isCall: boolean,
  id?: string | number
) => {
  return useQuery({
    queryKey: ['useGetStockPermission', id],
    enabled: !!id && isCall,
    queryFn: () => PartnerCatalogService.getStockPermission(id!),
  });
};

export const useCreateStockPermission = (
  onSuccess?: (data: any) => void,
  onFail?: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PartnerCatalogService.createStockPermission,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ['useGetStockPermission'],
      });
      NotificationSuccess('Thêm mới thành công');
      onSuccess && onSuccess(data);
    },
    onError() {
      onFail && onFail();
    },
  });
};

export const useCreateProductAuthorization = (
  onSuccess?: (data: any) => void,
  onFail?: () => void
) => {
  return useMutation({
    mutationFn: PartnerCatalogService.createProductAuthorization,
    onSuccess(data) {
      NotificationSuccess('Phân quyền sản phẩm thành công!');
      onSuccess && onSuccess(data);
    },
    onError() {
      onFail && onFail();
    },
  });
};

export const useUpdateStatusPartner = (
  onSuccess?: (data: any) => void,
  onFail?: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PartnerCatalogService.updateStatusPartner,
    onSuccess(data, variables) {
      if (variables.status === 0) {
        NotificationSuccess('Khóa đối tác thành công');
      } else if (variables.status === 1) {
        NotificationSuccess('Mở khóa đối tác thành công');
      }
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PARTNER_CATALOG_LIST],
      });
      onSuccess && onSuccess(data);
    },
    onError() {
      onFail && onFail();
    },
  });
};

export const useCreatePartner = (
  onSuccess?: (data: any) => void,
  onFail?: (error: IFieldErrorsItem[]) => void
) => {
  return useMutation({
    mutationFn: PartnerCatalogService.createOrganizationPartner,
    onSuccess(data) {
      NotificationSuccess('Thêm mới thành công');
      onSuccess && onSuccess(data);
    },
    onError(error: IErrorResponse) {
      if (error?.errors) {
        onFail && onFail(error?.errors);
      }
    },
  });
};

export const useUpdatePartner = (
  onSuccess?: (data: any) => void,
  onFail?: (error: IFieldErrorsItem[]) => void
) => {
  return useMutation({
    mutationFn: PartnerCatalogService.putOrganizationPartner,
    onSuccess(data) {
      NotificationSuccess('Cập nhật thành công');
      onSuccess && onSuccess(data);
    },
    onError(error: IErrorResponse) {
      if (error?.errors) {
        onFail && onFail(error?.errors);
      }
    },
  });
};

export const useGetOrganizationPartnerDetail = (
  onSuccess: (data: IOrganizationUnitDTO) => void
) => {
  return useMutation({
    mutationFn: PartnerCatalogService.getOrganizationPartnerDetail,
    onSuccess(data) {
      onSuccess(data);
    },
  });
};
export const useGetCCCDInfo = (onSuccess: (data: ICCCDInfo) => void) => {
  return useMutation({
    mutationFn: PartnerCatalogService.getCCCDInfor,
    onSuccess(data) {
      onSuccess(data);
    },
  });
};
