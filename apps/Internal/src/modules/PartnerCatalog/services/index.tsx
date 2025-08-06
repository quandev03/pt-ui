import { IPage } from '@vissoft-react/common';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';
import type { AxiosRequestHeaders } from 'axios';
import { Key } from 'react';
import {
  ICCCDInfo,
  IOrganizationUnitDTO,
  IParamsProductByCategory,
  IPartnerCatalogParams,
  IPayloadPartner,
  IProductAuthorization,
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
    return safeApiClient.get<IPage<any>>(
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
    const res = await safeApiClient.get<IOrganizationUnitDTO>(
      `${prefixSaleService}/organization-partner/${id}`
    );
    if (res.contractNoFileUrl) {
      const contractNoFileUrl = await PartnerCatalogService.getPreviewFile(
        res.contractNoFileUrl
      );
      res.contractNoFileLink = contractNoFileUrl;
    }
    if (res.businessLicenseFileUrl) {
      const businessLicenseFileLink =
        await PartnerCatalogService.getPreviewFile(res.businessLicenseFileUrl);
      res.businessLicenseFileLink = businessLicenseFileLink;
    }
    if (
      res?.deliveryInfos &&
      res?.deliveryInfos?.length > 0 &&
      res?.deliveryInfos[0]
    ) {
      const deliveryInfos = res?.deliveryInfos[0];
      if (deliveryInfos?.idCardFrontSiteFileUrl) {
        const idCardFrontSiteFileLink =
          await PartnerCatalogService.getPreviewFile(
            deliveryInfos?.idCardFrontSiteFileUrl
          );
        deliveryInfos.idCardFrontSiteFileLink = idCardFrontSiteFileLink;
      }
      if (deliveryInfos?.idCardBackSiteFileUrl) {
        const idCardBackSiteFileLink =
          await PartnerCatalogService.getPreviewFile(
            deliveryInfos?.idCardBackSiteFileUrl
          );
        deliveryInfos.idCardBackSiteFileLink = idCardBackSiteFileLink;
      }
      if (deliveryInfos?.multiFileUrl) {
        const multiFileLink = await PartnerCatalogService.getPreviewFile(
          deliveryInfos?.multiFileUrl
        );
        deliveryInfos.multiFileLink = multiFileLink;
      }
      res.deliveryInfos = [deliveryInfos];
    }
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
    formData.append('contractFile', payload.contractFile);
    formData.append('businessLicenseFile', payload.businessLicenseFile);
    formData.append('idCardFrontSite', payload.idCardFrontSite);
    formData.append('idCardBackSite', payload.idCardBackSite);
    formData.append('portrait', payload.portrait);

    formData.append(
      'organizationUnitDTO',
      new Blob([JSON.stringify(payload.organizationUnitDTO)], {
        type: 'application/json',
      })
    );
    formData.append(
      'organizationDeliveryInfoDTO',
      new Blob([JSON.stringify(payload.organizationDeliveryInfoDTO)], {
        type: 'application/json',
      })
    );

    return safeApiClient.post<any>(
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
    if (payload.contractFile) {
      formData.append('contractFile', payload.contractFile as Blob);
    }
    if (payload.businessLicenseFile) {
      formData.append(
        'businessLicenseFile',
        payload.businessLicenseFile as Blob
      );
    }
    if (payload.idCardFrontSite) {
      formData.append('idCardFrontSite', payload.idCardFrontSite as Blob);
    }
    if (payload.idCardBackSite) {
      formData.append('idCardBackSite', payload.idCardBackSite as Blob);
    }
    if (payload.portrait) {
      formData.append('portrait', payload.portrait as Blob);
    }
    formData.append(
      'organizationUnitDTO',
      new Blob([JSON.stringify(payload.organizationUnitDTO)], {
        type: 'application/json',
      })
    );
    formData.append(
      'organizationDeliveryInfoDTO',
      new Blob([JSON.stringify(payload.organizationDeliveryInfoDTO)], {
        type: 'application/json',
      })
    );

    return safeApiClient.put<any>(
      `${prefixSaleService}/organization-partner/${payload.id}/update`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        } as AxiosRequestHeaders,
      }
    );
  },
  getCCCDInfor: (payload: any) => {
    const formData = new FormData();
    formData.append('cardFront', payload.cardFront as Blob);
    formData.append('cardBack', payload.cardBack as Blob);
    formData.append('portrait', payload.portrait as Blob);

    return safeApiClient.post<ICCCDInfo>(
      `${prefixSaleService}/activation-info?cardType=1`,
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
};
