import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export const queryKeyDetailContract = 'query-detail-contract';

export interface ParamDetailContract {
  id: string | null;
  isSigned: boolean;
  isND13?: boolean;
  isIframePdf?: boolean;
}

const fetcher = (param: ParamDetailContract) => {
  if (param.isND13 === true) {
    if (param.isSigned === true) {
      return axiosClient.get<any, any>(
        `${prefixCustomerService}/contract-decree/view-before/${param.id}`,
        { responseType: 'blob' }
      );
    } else {
      return axiosClient.get<any, any>(
        `${prefixCustomerService}/contract-decree/view-after/${param.id}`,
        { responseType: 'blob' }
      );
    }
  } else {
    return axiosClient.get<any, any>(
      `${prefixCustomerService}/contract/${param.id}`,
      { responseType: 'blob' }
    );
  }
};

export const useDetailContract = (param: ParamDetailContract) => {
  const enable = param.isIframePdf
    ? !!param.id && !param.isND13 && param.isSigned
    : !!param.id;
  return useQuery({
    queryFn: () => fetcher(param),
    queryKey: [queryKeyDetailContract, param.id, param.isSigned, param.isND13],
    enabled: enable,
  });
};
