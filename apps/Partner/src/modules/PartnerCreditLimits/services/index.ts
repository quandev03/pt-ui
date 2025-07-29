import { IPage } from '@react/commons/types';
import { prefixCatalogServicePublic } from '@react/url/app';
import { axiosClient } from 'apps/Partner/src/service';
import { IPartnerCreditLimitsList, IPartnerLimitsHistoryParams } from '../type';

export const PartnerCreditLimitsServices = {
  getListPartnerDebtLimitsHistory: (params: IPartnerLimitsHistoryParams) => {
    const { ...res } = params;
    return axiosClient.get<string, IPage<IPartnerCreditLimitsList>>(
      `${prefixCatalogServicePublic}/organization-limit/get-debt-histories-of-current-partner`,
      {
        params: res,
      }
    );
  },
  getListPartnerLimitsId: () => {
    return axiosClient.get<string, IPartnerCreditLimitsList>(
      `${prefixCatalogServicePublic}/organization-limit/get-limit-of-current-partner`
    );
  },
};
