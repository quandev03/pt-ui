import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IParamsPostCheckList, IPostCheckList } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface ContentItem {
  id: string;
  address: string;
  createdBy: string;
  createdDate: string;
  email: string;
  feeAmount: string;
  fullName: string;
  modifiedDate: string;
  newSerial: string;
  oldSerial: string;
  payStatus: string;
  phoneNumber: string;
  reason: string;
  receiverPhone: string;
  rejectReason: string;
  requestId: string;
  requestSimType: string;
  requestType: string;
  status: number;
  expire: boolean;
}

const fetcher = async (params: IParamsPostCheckList) => {
  return axiosClient.get<IParamsPostCheckList, IPage<IPostCheckList[]>>(
    `${prefixCustomerService}/enterprise/search`,
    { params }
  );
};

export const useGetEnterpriseSearch = (params: IParamsPostCheckList) => {
  return useQuery({
    queryKey: ['enterprise/search', params],
    queryFn: () => fetcher(params),
    enabled: !!params.isCallApi,
  });
};
