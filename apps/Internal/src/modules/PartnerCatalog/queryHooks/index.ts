import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { PartnerCatalogService } from '../services';
import {
  ICCCDInfo,
  IOrganizationUnitDTO,
  IParamsProductByCategory,
  IPartnerCatalogParams,
  IStockNumberParams,
} from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import {
  IErrorResponse,
  IFieldErrorsItem,
  IParamsRequest,
  NotificationSuccess,
} from '@vissoft-react/common';

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

export const useGetOrganizationUsersByOrgCode = (
  partnerCode: string,
  params: IParamsRequest
) => {
  return useQuery({
    queryKey: ['organizationUsersByOrgId', partnerCode, params],
    queryFn: () =>
      PartnerCatalogService.getOrganizationUsersByOrgId(partnerCode, params),
    enabled: !!partnerCode,
  });
};

export const useGetDetailByCode = (code: string) => {
  return useQuery({
    queryKey: ['unitByCode', code],
    queryFn: () => PartnerCatalogService.getUnitByCode(code),
    enabled: !!code,
  });
};

export const useCreateOrganizationUserByClientIdentity = (
  onSuccess?: (data: any) => void,
  onFail?: (error: IFieldErrorsItem[]) => void
) => {
  return useMutation({
    mutationFn: ({
      clientIdentity,
      payload,
    }: {
      clientIdentity: string;
      payload: any;
    }) =>
      PartnerCatalogService.createOrganizationUserByClientIdentity(
        clientIdentity,
        payload
      ),
    onSuccess(data) {
      NotificationSuccess('Thêm mới người dùng thành công');
      onSuccess && onSuccess(data);
    },
    onError(error: IErrorResponse) {
      if (error?.errors) {
        onFail && onFail(error.errors);
      }
    },
  });
};
export const useGetAllPartnerRoles = () => {
  return useQuery({
    queryKey: ['get-all-partner-roles'],
    queryFn: () => PartnerCatalogService.getAllPartnerRoles(),
  });
};

export const useGetOrganizationUserDetail = (
  clientIdentity: string,
  id: string
) => {
  return useQuery({
    queryKey: ['organization-user-detail', clientIdentity, id],
    queryFn: () =>
      PartnerCatalogService.getOrganizationUserDetail(clientIdentity, id),
    enabled: !!clientIdentity && !!id,
  });
};

export const useUpdatePartnerUser = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: ({
      clientIdentity,
      id,
      payload,
    }: {
      clientIdentity: string;
      id: string;
      payload: any;
    }) => PartnerCatalogService.updatePartnerUser(clientIdentity, id, payload),

    onSuccess: (data) => {
      onSuccess?.(data);
      NotificationSuccess('Cập nhật người dùng thành công');
    },

    onError: (error) => {
      onError?.(error);
    },
  });
};
