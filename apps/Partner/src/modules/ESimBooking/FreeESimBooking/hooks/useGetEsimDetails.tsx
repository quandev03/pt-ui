import { useQuery } from '@tanstack/react-query';
import { IBookEsimDetails } from '../types';
import { freeEsimBookingServices } from '../services';
import { REACT_QUERY_KEYS } from '../../../../../src/constants/query-key';

export const useGetEsimDetails = (id: string | undefined) => {
  return useQuery<IBookEsimDetails, Error>({
    queryKey: [REACT_QUERY_KEYS.GET_ESIM_DETAILS, id],
    queryFn: () => freeEsimBookingServices.getEsimDetails(id),
    enabled: !!id,
  });
};
