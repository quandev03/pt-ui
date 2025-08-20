import { AnyElement, IPage, IParamsRequest } from '@vissoft-react/common';
import {
  prefixAuthService,
  prefixSaleService,
} from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import type { AxiosRequestHeaders } from 'axios';
import { Key } from 'react';
import {
  IAssignPackagePayload,
  IOrganizationUnitDTO,
  IParamsProductByCategory,
  IPartner,
  IPartnerCatalogParams,
  IPayloadPartner,
  IProductAuthorization,
  IRoleItem,
  IStockNumber,
  IStockNumberParams,
} from '../types';
export const PartnerCatalogService = {
  getOrganizationPartner: (params: IPartnerCatalogParams) => {
    return safeApiClient.get<IPage<IOrganizationUnitDTO>>(
      `${prefixSaleService}/organization-partner`,
      {
        params,
      }
    );
  },
  getProductByCategory: (params: IParamsProductByCategory) => {
    return safeApiClient.get<IPage<AnyElement>>(
      `${prefixSaleService}/product/search-flat`,
      { params }
    );
  },
  getProductAuthorization: (id: string | number) => {
    return safeApiClient.get<IProductAuthorization[]>(
      `${prefixSaleService}/organization-partner/${id}/organization-product`
    );
  },
  createProductAuthorization: (data: {
    id: string | number;
    payload: (string | number)[];
  }) => {
    const { id, payload } = data;
    return safeApiClient.post(
      `${prefixSaleService}/organization-partner/${id}/organization-product`,
      payload
    );
  },
  getOrganizationPartnerDetail: async (id: string | number) => {
    const res = await safeApiClient.get<IPartner>(
      `${prefixSaleService}/organization-partner/${id}`
    );
    return res;
  },
  updateStatusPartner: async ({
    id,
    status,
    orgCode,
  }: {
    id: string | number;
    status: 0 | 1;
    orgCode: string;
  }) => {
    const resPromise = safeApiClient.put<IOrganizationUnitDTO>(
      `${prefixSaleService}/organization-partner/${id}/update-status?status=${status}`
    );
    const updateStatusClientPromise = safeApiClient.put<IOrganizationUnitDTO>(
      `${prefixSaleService}/clients/${orgCode}/status`,
      { status }
    );
    const [res] = await Promise.all([resPromise, updateStatusClientPromise]);
    return res;
  },
  createOrganizationPartner: (payload: IPayloadPartner) => {
    const formData = new FormData();

    formData.append(
      'organizationUnitDTO',
      new Blob([JSON.stringify(payload.organizationUnitDTO)], {
        type: 'application/json',
      })
    );

    return safeApiClient.post<AnyElement>(
      `${prefixSaleService}/organization-partner`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        } as AxiosRequestHeaders,
      }
    );
  },
  putOrganizationPartner: (payload: IPayloadPartner) => {
    const formData = new FormData();
    formData.append(
      'organizationUnitDTO',
      new Blob([JSON.stringify(payload.organizationUnitDTO)], {
        type: 'application/json',
      })
    );

    return safeApiClient.put<AnyElement>(
      `${prefixSaleService}/organization-partner/${payload.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        } as AxiosRequestHeaders,
      }
    );
  },
  getStockPermission: (id: string | number) => {
    return safeApiClient.get<IStockNumber[]>(
      `${prefixSaleService}/organization-partner/${id}/stock-permission`
    );
  },
  getStockNumber: (params: IStockNumberParams) => {
    const url = `${prefixSaleService}/stock-isdn-org/find/by-stock-type?${params}`;
    return safeApiClient.get<IPage<IStockNumber>>(url);
  },
  createStockPermission: (payload: {
    data: { stockIds: Key[] };
    id: string;
  }) => {
    const { data, id } = payload;
    return safeApiClient.post<IStockNumber>(
      `${prefixSaleService}/organization-partner/${id}/stock-permission`,
      data
    );
  },
  getPreviewFile: (uri: string) => {
    return safeApiClient.get<Blob>(`${prefixSaleService}/file/${uri}`, {
      responseType: 'blob',
    });
  },
  getOrganizationUsersByOrgId: (
    partnerCode: string,
    params: IParamsRequest
  ) => {
    return safeApiClient.get<AnyElement>(
      `${prefixAuthService}/api/users/partner/${partnerCode}`,
      {
        params,
      }
    );
  },
  getUnitByCode: (code: string) => {
    return safeApiClient.get<AnyElement>(
      `${prefixSaleService}/organization-partner/get-by-code/${code}`
    );
  },

  getPartnerInfoByCode: (code: string) => {
    return safeApiClient.get<IPartner>(
      `${prefixSaleService}/organization-partner/get-by-code/${code}`
    );
  },

  createOrganizationUserByClientIdentity: (
    clientIdentity: string,
    payload: AnyElement
  ) => {
    return safeApiClient.post<AnyElement>(
      `${prefixAuthService}/api/users/partner/${clientIdentity}`,
      payload
    );
  },
  getAllPartnerRoles: () => {
    return safeApiClient.get<IRoleItem[]>(
      `${prefixAuthService}/api/roles/partner/all`
    );
  },

  getOrganizationUserDetail: (clientIdentity: string, id: string) => {
    return safeApiClient.get<AnyElement>(
      `${prefixAuthService}/api/users/partner/${clientIdentity}/${id}`
    );
  },
  updatePartnerUser: (
    clientIdentity: string,
    id: string,
    payload: AnyElement
  ) => {
    return safeApiClient.put(
      `${prefixAuthService}/api/users/partner/${clientIdentity}/${id}`,
      payload
    );
  },
  assignPackagePermission: (payload: IAssignPackagePayload) => {
    return safeApiClient.post(
      `${prefixSaleService}/organization-partner/packages`,
      payload
    );
  },
  getAssignedPackages: (clientId: string) => {
    return safeApiClient.get<AnyElement>(
      `${prefixSaleService}/organization-partner/${clientId}/packages`
    );
  },
};
