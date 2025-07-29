import { IPage } from '@react/commons/types';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IPartnerCreditLimitsList,
  IPartnerCreditLimitsParams,
  IPartnerLimitsHistoryParams,
  IPartnerWithoutLimit,
  IPayloadCreateForm,
  IPayloadCreateFormDebtAdjustment,
} from '../type';
import { prefixCatalogService } from '@react/url/app';

export const PartnerCreditLimitsServices = {
  getListPartnerCreditLimits: (params: IPartnerCreditLimitsParams) => {
    return axiosClient.get<string, IPage<IPartnerCreditLimitsList>>(
      `${prefixCatalogService}/organization-limit/search`,
      {
        params: { ...params },
      }
    );
  },
  getPartnerWithoutLimit: () => {
    return axiosClient.get<string, IPartnerWithoutLimit[]>(
      `${prefixCatalogService}/organization-unit/find/partners-without-organization-limit`
    );
  },
  getListPartnerDebtLimitsHistory: (params: IPartnerLimitsHistoryParams) => {
    const { id, ...res } = params;
    return axiosClient.get<string, IPage<IPartnerCreditLimitsList>>(
      `${prefixCatalogService}/organization-debt-histories/${id}`,
      {
        params: res,
      }
    );
  },
  getListPartnerLimitsHistory: (params: IPartnerLimitsHistoryParams) => {
    const { id, ...res } = params;
    return axiosClient.get<string, IPage<IPartnerCreditLimitsList>>(
      `${prefixCatalogService}/organization-limit/histories/${id}`,
      {
        params: res,
      }
    );
  },
  getListPartnerLimitsId: (id: string) => {
    return axiosClient.get<string, IPartnerCreditLimitsList>(
      `${prefixCatalogService}/organization-limit/${id}`
    );
  },
  putListPartnerCreditLimits: (
    payload: IPayloadCreateForm & { id: string }
  ) => {
    const formData = new FormData();
    const { description, files, limitAmount, orgId, id } = payload;
    formData.append(
      'dto',
      new Blob(
        [
          JSON.stringify({
            description,
            limitAmount,
            orgId,
            attachments: files
              ? files
                  .filter((item) => item.id)
                  .map((item) => ({ id: item.id, description: item.desc }))
              : [],
          }),
        ],
        {
          type: 'application/json',
        }
      )
    );
    formData.append(
      'attachmentDescriptions',
      new Blob(
        [
          JSON.stringify(
            files.filter((item) => !item.id).map((item) => item.desc)
          ),
        ],
        {
          type: 'application/json',
        }
      )
    );
    files
      .filter((item) => !item.id)
      .forEach((item) => {
        formData.append('files', item.files as Blob);
      });

    return axiosClient.put<string, IPage<IPartnerCreditLimitsList>>(
      `${prefixCatalogService}/organization-limit/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
  createDebtAdjustment: (payload: IPayloadCreateFormDebtAdjustment) => {
    const formData = new FormData();
    const {
      description,
      files,
      debtAmount,
      debtType,
      orgId,
      reasonId,
      adjustmentDate,
    } = payload;
    formData.append(
      'dto',
      new Blob(
        [
          JSON.stringify({
            description,
            debtAmount,
            debtType,
            orgId,
            reasonId,
            adjustmentDate,
          }),
        ],
        {
          type: 'application/json',
        }
      )
    );
    if (files) {
      formData.append(
        'attachmentDescriptions',
        new Blob([JSON.stringify(files.map((item) => item.desc ?? ''))], {
          type: 'application/json',
        })
      );
      files.forEach((item) => {
        formData.append('files', item.files as Blob);
      });
    }

    return axiosClient.post<string, IPage<IPartnerCreditLimitsList>>(
      `${prefixCatalogService}/organization-debt-histories`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
  createListPartnerCreditLimits: (payload: IPayloadCreateForm) => {
    const formData = new FormData();
    const { description, files, limitAmount, orgId } = payload;
    formData.append(
      'dto',
      new Blob([JSON.stringify({ description, limitAmount, orgId })], {
        type: 'application/json',
      })
    );
    if (files) {
      formData.append(
        'attachmentDescriptions',
        new Blob([JSON.stringify(files.map((item) => item.desc ?? ''))], {
          type: 'application/json',
        })
      );
      files.forEach((item) => {
        formData.append('files', item.files as Blob);
      });
    }

    return axiosClient.post<string, IPage<IPartnerCreditLimitsList>>(
      `${prefixCatalogService}/organization-limit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};
