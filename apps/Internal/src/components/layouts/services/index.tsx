import {
  IPage,
  IPageRequestListTable,
  MenuObjectItem,
} from '@react/commons/types';
import { getParamsString } from '@react/helpers/utils';
import { prefixEventService } from '@react/url/app';
import { OidcClientCredentials } from 'apps/Internal/src/constants';
import {
  baseApiUrl,
  prefixAuthServicePrivate,
  prefixCatalogService,
  prefixCustomerService,
  prefixSaleService,
} from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import axios from 'axios';
import {
  AllUserType,
  ExportRequest,
  GetALLData,
  ICriteriaItem,
  INotification,
  INotificationParams,
  IUserInfo,
  ParamsOption,
} from '../types';

export const LayoutService = {
  getProfile: async () => {
    const res = await axiosClient.get<string, IUserInfo>(
      `${prefixAuthServicePrivate}/api/auth/profile`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getMenu: async () => {
    const res = await axiosClient.get<any, MenuObjectItem[]>(
      `${prefixAuthServicePrivate}/api/auth/menu/flat`
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  getParamsOption() {
    return axiosClient.get<any, ParamsOption>(`${prefixSaleService}/params`);
  },
  getFileDownloadSaleService: async (payload: {
    id: number;
    fileName: string;
  }) => {
    const res = await axiosClient.get<string, Blob>(
      `${prefixSaleService}/files/${payload.id}`,
      {
        responseType: 'blob',
      }
    );
    return res;
  },
  getDataTableByDomain: async <T,>({
    queryKey,
  }: {
    queryKey: [string, IPageRequestListTable];
  }) => {
    const { domain, ...params } = queryKey[1];
    const stringParams = getParamsString(params);
    const res = await axiosClient.get<any, IPage<T>>(
      `${prefixAuthServicePrivate}/api/search/${domain}?${stringParams}`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getAllUsers: async (params: AllUserType) => {
    let url = '';
    if (params.isPartner) {
      url = `${prefixAuthServicePrivate}/api/users/partner/${params.clientIdentity}/all`;
    } else {
      url = `${prefixAuthServicePrivate}/api/users/internal/all`;
    }
    const res = await axiosClient.get<any, GetALLData[]>(url);
    if (!res) throw new Error('Oops');
    return res;
  },
  getAllRoles: async ({ isPartner }: { isPartner: boolean }) => {
    const res = await axiosClient.get<any, GetALLData[]>(
      `${prefixAuthServicePrivate}/api/roles/${
        isPartner ? 'partner' : 'internal'
      }/all`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getCriteria: async () => {
    const res = await axiosClient.post<any, ICriteriaItem[]>(
      `${prefixCustomerService}/get-application-config?type=SUBSCRIBER_ACTIVE_REQUIREMENT`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getCurrentUser: async () => {
    const res = await axiosClient.get<any, any>(
      `${prefixAuthServicePrivate}/api/auth/profile`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getImage: async (
    url: string,
    isProfilePicture?: boolean,
    isBlob?: boolean
  ) => {
    try {
      const blob = (await axiosClient.get(
        `${prefixCustomerService}/${
          isProfilePicture ? 'profile-picture' : 'file'
        }${url}`,
        { responseType: 'blob' }
      )) as Blob;

      const contentType = blob.type || '';

      if (contentType === 'application/pdf') {
        return {
          isPdf: true,
          url: window.URL.createObjectURL(blob),
        };
      }

      return isBlob ? blob : window.URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  },
  getPdf: async (url: string) => {
    const blob = (await axiosClient.get(`${prefixCustomerService}/file${url}`, {
      responseType: 'blob',
    })) as Blob;
    return window.URL.createObjectURL(blob);
  },
  getPdfBlob: async (url: string) => {
    const blob = (await axiosClient.get(`${prefixCustomerService}/file${url}`, {
      responseType: 'blob',
    })) as Blob;
    return blob;
  },
  logout: async (refreshToken: string) => {
    const formReq = new URLSearchParams();
    formReq.append('token', refreshToken);
    const res = await axios.post<any, void>(
      `${prefixAuthServicePrivate}/oauth2/revoke`,
      formReq,
      {
        baseURL: baseApiUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            OidcClientCredentials.clientId +
              ':' +
              OidcClientCredentials.clientSecret
          )}`,
        },
      }
    );
    return res;
  },
  downloadPdf: (data: ExportRequest) => {
    return axiosClient.get<string, Blob>(data.uri, {
      responseType: 'blob',
    });
  },
  getImageCatalog: async (url: string) => {
    const res = await axiosClient.get<any, Blob>(
      `${prefixCatalogService}/file${url}`,
      { responseType: 'blob' }
    );
    return window.URL.createObjectURL(res);
  },
  getNotification: async (params: INotificationParams) => {
    const res = await axiosClient.get<string, IPage<INotification>>(
      `${prefixEventService}/notifications`,
      { params }
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  readOneNotification: async (id: string) => {
    const res = await axiosClient.patch(
      `${prefixEventService}/notifications/${id}`
    );
    return res;
  },
  readAllNotification: async () => {
    const res = await axiosClient.patch(`${prefixEventService}/notifications`);
    return res;
  },
};
