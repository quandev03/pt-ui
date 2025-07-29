import { prefixCatalogService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (orgType?: string) => {
  return axiosClient.get<string, any>(
    `${prefixCatalogService}/organization-unit?status=1&org-sub-type=${orgType ?? ""}`
  );
};

export const useGetAllOrganizationUnitActive = (orgType?: string) => {
  return useQuery({
    queryKey: ['useGetAllOrganizationUnitActive', orgType],
    queryFn: () => fetcher(orgType),
    select: (data) =>
      data.map((item: any) => ({ label: item.orgName, value: item.id })),
  });
};
