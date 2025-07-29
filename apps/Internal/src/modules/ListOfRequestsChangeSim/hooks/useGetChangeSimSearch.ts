import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IParamsPostCheckList, IPostCheckList } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface ContentItem {
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
  requestSimTypeCode: string;
  requestType: string;
  status: string;
  expire: boolean;
  payStatusCode: number;
  statusCode: number;
}

const fetcher = async (params: IParamsPostCheckList) => {
  return axiosClient.get<IParamsPostCheckList, IPage<IPostCheckList[]>>(
    `${prefixCustomerService}/change-sim/search`,
    { params }
  );
};

export const useGetChangeSimSearch = (params: IParamsPostCheckList) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_POST_CHECK_LIST, params],
    queryFn: () => fetcher(params),
    enabled: !!params.isCallApi,
  });
};
