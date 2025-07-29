import {
  prefixApprovalServicePublic,
  prefixResourceService,
  prefixSaleService,
} from '@react/url/app';

export const API_PATHS = {
  POST_DISTRIBUTE_NUMBER: `${prefixResourceService}/distribute-number`,
  DETAIL_DISTRIBUTE_NUMBER: (id?: number | string) =>
    `${prefixResourceService}/distribute-number/${id}`,
  GET_SAMPLE: `${prefixResourceService}/distribute-number/samples/xlsx`,
  GET_ORGANIZATION_CURRENT: `${prefixSaleService}/organization-user/get-organization-current`,
  CANCEL_DISTRIBUTE_NUMBER: (id: number) =>
    `${prefixResourceService}/distribute-number/cancel/${id}`,
  APPROVAL_PROCESSS_STEP: `${prefixApprovalServicePublic}/approval/approval-process-step`,
  DOWNLOAD_FILE: `${prefixResourceService}/download-file`,
};
