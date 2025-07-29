import { prefixCustomerServicePublic } from '@react/url/app';
import { pathRouterSign } from '@react/url/pathRouterSign';
import { useMutation } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Sign/src/service';

export interface FilterSubmitContract {
  contractNo: string;
  signature: Blob;
  timeStampContract?: string;
  pathname?: string;
  checkSkySale?: boolean;
  form?: FormInstance;
}

interface Res {
  contractId: string;
}
export const queryKeySubmitContract = 'query-submit-contract';

const fetcher = ({
  contractNo,
  signature,
  timeStampContract,
  pathname,
  checkSkySale,
  form
}: FilterSubmitContract) => {
  const formData = new FormData();
  formData.append('signature', signature);
  formData.append('contractNo', contractNo);
  if (checkSkySale && form) {
    formData.append('idNo', form.getFieldValue('idNo') || '');
    formData.append('sessionId', form.getFieldValue('sessionId') || '');
  }
  if (timeStampContract)
    formData.append('timeStampContract', timeStampContract);

  if (checkSkySale) {
    return axiosClient.post<FilterSubmitContract, Res>(
      `${prefixCustomerServicePublic}/sky-sale/gen-contract-final`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
  if (pathname === pathRouterSign.preContract) {
    return axiosClient.post<FilterSubmitContract, Res>(
      `${prefixCustomerServicePublic}/gen-confirmation-pre-check/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
  if (pathname === pathRouterSign.changeSim) {
    return axiosClient.post<FilterSubmitContract, Res>(
      `${prefixCustomerServicePublic}/change-sim/gen-contract/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
  if (pathname === pathRouterSign.changeInfo) {
    return axiosClient.post<FilterSubmitContract, Res>(
      `${prefixCustomerServicePublic}/change-information/gen-final-contract`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
  else {
    const url =
      pathname === pathRouterSign.censorship
        ? `${prefixCustomerServicePublic}/gen-contract-approve/submit`
        : `${prefixCustomerServicePublic}/gen-contract/submit`;
    return axiosClient.post<FilterSubmitContract, Res>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export const useSubmitContract = () => {
  return useMutation({
    mutationKey: [queryKeySubmitContract],
    mutationFn: fetcher,
  });
};
