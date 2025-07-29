import { prefixCustomerServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Sign/src/service';

export interface FilterSubmitContract {
  contractId: string;
  file: Blob;
  customerType: string | null;
}

interface Res {
  contractId: string;
}
export const queryKeySubmitContract = 'query-submit-contract';

const fetcher = ({ contractId, file, customerType }: FilterSubmitContract) => {
  const formData = new FormData();
  formData.append(
    customerType === 'old' ? 'transferorSignature' : 'transfereeSignature',
    file
  );

  return axiosClient.post<FilterSubmitContract, Res>(
    `${prefixCustomerServicePublic}/change-information/gen-ownership-transfer-contract/submit?contractId=${contractId}`,
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
