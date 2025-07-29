import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const queryKeyDetailContract = 'query-detail-contract';

const fetcher = (id: string | null) => {
  return axiosClient.get<any, any>(
    `customer-management/private/api/v1/contract/${id}`,
    { responseType: 'blob' }
  );
};

export const useDetailContract = (id: string | null) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyDetailContract, id],
    select: (data) => data,
    enabled: !!id,
  });
};
