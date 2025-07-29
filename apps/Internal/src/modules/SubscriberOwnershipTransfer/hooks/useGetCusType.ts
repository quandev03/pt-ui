import { prefixCustomerService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const useGetCusTypeKeyKey = 'useGetCusTypeKeyKey';

export interface ICusType {
  id: number;
  type: string;
  code: string;
  name: string;
  dataType: any;
  value: string;
  status: number;
  statusOnline: any;
}

const fetcher = async () => {
  return axiosClient.post<string, ICusType[]>(
    `${prefixCustomerService}/get-application-config?type=CUS_TYPE`
  );
};

export const useGetCusType = () => {
  return useQuery({
    queryKey: [useGetCusTypeKeyKey],
    queryFn: fetcher,
    select: (data) =>
      data.map((item) => ({ label: item.name, value: item.code })),
  });
};
