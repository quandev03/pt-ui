import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../service';
import { prefixCatalogService } from '@react/url/app';

export type Cadastral = {
  id: number;
  areaId: number;
  areaCode: string;
  areaName: string;
};

const fetcher = (parentId?: string | number) => {
  return axiosClient.get<any, Cadastral[]>(
    `${prefixCatalogService}/area?parentId=${parentId}`
  );
};

export const useArea = (key: string, parentId?: string | number) => {
  return useQuery({
    queryKey: [key, parentId],
    enabled: key === 'provinces' ? true : !!parentId,
    queryFn: () => fetcher(parentId),
  });
};
