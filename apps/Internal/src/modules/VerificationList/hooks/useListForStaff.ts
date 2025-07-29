import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IVerificationItem, IVerificationParams } from '../types';
import useCensorshipStore from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const fetcher = (params: IVerificationParams) => {
  let processedSearchText = params.searchText;
  if (params.searchText) {
    const trimmedText = params.searchText.trim();
    if (/^0\d+$/.test(trimmedText)) {
      processedSearchText = trimmedText.substring(1);
    } else {
      processedSearchText = trimmedText;
    }
  }
  return axiosClient.get<IVerificationParams, IPage<IVerificationItem>>(
    `${prefixCustomerService}/get-sub-document-staff`,
    { params: { ...params, size: 10000, ...(processedSearchText && { searchText: processedSearchText }) } }
  );
};
export const useListForStaff = (params: IVerificationParams) => {
  const { isAdmin } = useCensorshipStore();
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_CENSORSHIP_LIST_FOR_STAFF, params],
    queryFn: () => fetcher(params),
    enabled: !!params.type && isAdmin === false,
  });
};
