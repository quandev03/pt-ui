import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { IConfigItem } from '../types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = (type: number) => {
  return axiosClient.get<string, IConfigItem[]>(
    `${prefixCustomerService}/application-config/get-application-config-by-type?type=${type}`
  );
};
export const useCriteriaConfigList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_CRITERIA_CONFIG_LIST],
    queryFn: () => fetcher(1),
  });
};
export const useActivationConfigList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ACTIVATION_CONFIG_LIST],
    queryFn: () => fetcher(2),
  });
};
export const useTransferOfOwnershipConfigList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_TRANSFER_OF_OWNERSHIP_CONFIG_LIST],
    queryFn: () => fetcher(3),
  });
};
