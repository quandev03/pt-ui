import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from '../constants/app';
import { axiosClient } from '../service';

interface IReasonResponse {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  type: string;
  code: string;
  name: string;
  status: number | boolean;
  description: string | null;
}
const fetcher = async (type: string) => {
  const res = await axiosClient.get<any, IReasonResponse[]>(
    `${prefixCustomerService}/reason?type=${type}`
  );
  if (!res) throw new Error('Oops');
  return res;
};
export const useReasonCustomerService = (type: string, enabled = true) => {
  return useQuery({
    queryKey: ['customer-service-reason', type],
    queryFn: () => fetcher(type),
    staleTime: Infinity,
    enabled,
  });
};
