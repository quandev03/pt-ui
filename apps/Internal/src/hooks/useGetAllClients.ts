import { prefixAdminService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../service';
import { IPage } from '@react/commons/types';

export type ClientType = {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  code: string;
  name: string;
  contactName: string | null;
  contactPosition: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  permanentAddress: string | null;
  permanentProvinceId: string | null;
  permanentDistrictId: string | null;
  permanentWardId: string | null;
  status: number;
};
export const useGetAllClientsKey = 'useGetAllClientsKey';
type IClientParams = {
  page: number;
  size: number;
  q?: string;
};
const fetcher = (params: IClientParams) => {
  return axiosClient.get<IClientParams, IPage<ClientType>>(
    `${prefixAdminService}/clients`,
    { params }
  );
};

export const useGetAllClients = (params: IClientParams) => {
  return useQuery({
    queryKey: [useGetAllClientsKey, params],
    queryFn: () => fetcher(params),
    select: (data) => data.content,
  });
};
