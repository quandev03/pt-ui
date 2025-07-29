import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export type OrgUnitType = {
  address: string;
  districtCode: string;
  districtName: string;
  fullAddress: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  orgId: number;
  orgCode: string;
};

const fetcher = (params: any) => {
  return axiosClient.get<Request, OrgUnitType[]>(
    `${prefixCatalogService}/organization-unit/addresses`,
    { params: params }
  );
};

export const useListOrgUnit = (params: any) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: ['organization-unit/addresses', params],
    staleTime: Infinity,
  });
};
