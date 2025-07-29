import { IPage } from '@react/commons/types';
import { getParamsString } from '@react/helpers/utils';
import {
  prefixAuthService,
  prefixCatalogService,
  prefixCatalogServicePublic,
  prefixCustomerService,
} from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import { Key } from 'react';
import {
  ICatalogPartner,
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
    return axiosClient.get<string, IPage<ICatalogPartner>>(
      `${prefixCatalogServicePublic}/organization-partner`,
      {
        params,
      }
    );
  },
  getProductByCategory: (params: IParamsProductByCategory) => {
    return axiosClient.get<string, IPage<any>>(
      `${prefixCatalogService}/product/search-flat`,
      { params }
    );
  },
  getProductAuthorization: (id: string | number) => {
    return axiosClient.get<string, IProductAuthorization[]>(
      `${prefixCatalogServicePublic}/organization-partner/${id}/organization-product`
    );
  },
  createProductAuthorization: (data: {
    id: string | number;
    payload: (string | number)[];
  }) => {
    const { id, payload } = data;
    return axiosClient.post(
      `${prefixCatalogServicePublic}/organization-partner/${id}/organization-product`,
      payload
    );
  },
  getOrganizationPartnerDetail: async (id: string | number) => {
    const res = await axiosClient.get<string, IOrganizationUnitDTO>(
      `${prefixCatalogServicePublic}/organization-partner/${id}`
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
    const resPromise = axiosClient.put<string, IOrganizationUnitDTO>(
      `${prefixCatalogServicePublic}/organization-partner/${id}/update-status?status=${status}`
    );
    const updateStatusClientPromise = axiosClient.put<
      string,
      IOrganizationUnitDTO
    >(`${prefixAuthService}/private/api/clients/${orgCode}/status`, { status });
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

    return axiosClient.post<string, any>(
      `${prefixCatalogServicePublic}/organization-partner`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

    return axiosClient.put<string, any>(
      `${prefixCatalogServicePublic}/organization-partner/${payload.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
  getCCCDInfor: (payload: any) => {
    const formData = new FormData();
    formData.append('cardFront', payload.cardFront as Blob);
    formData.append('cardBack', payload.cardBack as Blob);
    formData.append('portrait', payload.portrait as Blob);

    return axiosClient.post<string, ICCCDInfo>(
      `${prefixCustomerService}/activation-info?cardType=1`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
  getStockPermission: (id: string | number) => {
    return axiosClient.get<string, IStockNumber[]>(
      `${prefixCatalogServicePublic}/organization-partner/${id}/stock-permission`
    );
  },
  getStockNumber: (params: IStockNumberParams) => {
    const paramString = getParamsString(params);
    const url = `${prefixCatalogServicePublic}/stock-isdn-org/find/by-stock-type?${paramString}`;
    return axiosClient.get<string, IPage<IStockNumber>>(url);
  },
  createStockPermission: (payload: {
    data: { stockIds: Key[] };
    id: string;
  }) => {
    const { data, id } = payload;
    return axiosClient.post<string, IStockNumber>(
      `${prefixCatalogServicePublic}/organization-partner/${id}/stock-permission`,
      data
    );
  },
  getPreviewFile: (uri: string) => {
    return axiosClient.get<string, Blob>(
      `${prefixCatalogService}/file/${uri}`,
      {
        responseType: 'blob',
      }
    );
  },
};
