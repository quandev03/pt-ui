import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../../constants/query-key';
import { packagedEsimBookingServices } from '../services';

export const useGetPackageCodes = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PACKAGES],
    queryFn: () => packagedEsimBookingServices.getPackageCodes(),
  });
};
