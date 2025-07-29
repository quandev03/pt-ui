import { prefixCustomerServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface FilterSubmitContract {
  contractNo: string;
  signature: Blob;
}

interface Res {
  contractId: string;
}
export const queryKeySubmitContract = 'query-submit-contract';

const fetcher = ({ contractNo, signature }: FilterSubmitContract) => {
  const formData = new FormData();
  formData.append('signature', signature);
  formData.append('contractNo', contractNo);

  return axiosClient.post<FilterSubmitContract, Res>(
    `${prefixCustomerServicePublic}/gen-contract/submit`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useSubmitContract = () => {
  return useMutation({
    mutationKey: [queryKeySubmitContract],
    mutationFn: fetcher,
  });
};
