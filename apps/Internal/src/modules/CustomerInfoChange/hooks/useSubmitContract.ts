import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

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
    `${prefixCustomerService}/gen-contract/submit`,
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
