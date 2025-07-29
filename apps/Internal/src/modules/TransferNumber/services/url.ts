import {
  prefixApprovalServicePublic,
  prefixResourceService,
} from '@react/url/app';

export const API_PATHS = {
  GET_STOCK_TRANSFER_NUMBER: `${prefixResourceService}/transfer-number`,
  GET_TRANSFER_NUMBER_DETAIL: (id: number | string) =>
    `${prefixResourceService}/transfer-number/${id}`,
  GET_FILE_UPLOAD: `${prefixResourceService}/transfer-number/samples/xlsx`,
  ADD_TRANSFER_NUMBER: `${prefixResourceService}/transfer-number`,
  CANCEL_TRANSFER_NUMBER: (id: number | string) =>
    `${prefixResourceService}/transfer-number/${id}`,
  GET_STOCK: `${prefixResourceService}/lookup-number/stocks`,
  GET_APPROVAL_PROCESS: `${prefixApprovalServicePublic}/approval/approval-process-step`,
};
