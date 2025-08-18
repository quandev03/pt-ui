import { useMutation, useQuery } from '@tanstack/react-query';
import {
  IErrorResponse,
  IFieldErrorsItem,
  IParamsRequest,
  NotificationSuccess,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { PartnerCatalogService } from '../services';
import { IPartner, IPartnerCatalogParams } from '../types';

export const useGetOrganizationPartner = (params: IPartnerCatalogParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.PARTNER_CATALOG_LIST, params],
    queryFn: () => PartnerCatalogService.getOrganizationPartner(params),
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
  onSuccess: (data: IPartner) => void
) => {
  return useMutation({
    mutationFn: PartnerCatalogService.getOrganizationPartnerDetail,
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

export const useGetPartnerInfoByCode = (
  onSuccess: (data: IPartner) => void,
  onError: (error: IFieldErrorsItem[]) => void
) => {
  return useMutation({
    mutationFn: PartnerCatalogService.getPartnerInfoByCode,
    onSuccess(data) {
      onSuccess(data);
    },
    onError(error: IErrorResponse) {
      if (error.errors) {
        onError(error.errors);
      }
    },
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
export const useAssignPackagePermission = () => {
  return useMutation({
    mutationFn: PartnerCatalogService.assignPackagePermission,
    onSuccess: () => {
      NotificationSuccess('Phân quyền gói cước thành công');
    },
  });
};
export const useGetAssignedPackages = (clientId: string) => {
  return useQuery({
    queryKey: ['get-assigned-packages', clientId],
    queryFn: () => PartnerCatalogService.getAssignedPackages(clientId),
  });
};
