import { useQuery } from '@tanstack/react-query';
import { safeApiClient } from '../services';
import { prefixSaleService } from '../constants';

export type Cadastral = {
  id: number;
  areaId: number;
  areaCode: string;
  areaName: string;
};

const fetcher = (parentId?: string | number) => {
  return safeApiClient.get<Cadastral[]>(
    `${prefixSaleService}/area?parentId=${parentId}`
  );
};

export const useArea = (key: string, parentId?: string | number) => {
  return useQuery({
    queryKey: [key, parentId],
    enabled: key === 'provinces' ? true : !!parentId,
    queryFn: () => fetcher(parentId),
  });
};
