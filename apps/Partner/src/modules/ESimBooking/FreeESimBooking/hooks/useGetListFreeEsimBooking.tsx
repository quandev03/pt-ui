import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../../constants/query-key';
import { freeEsimBookingServices } from '../services';
import { IFreeEsimBooking } from '../types';

export const useGetListFreeEsimBooking = (params: IFreeEsimBooking) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_FREE_ESIM_BOOKING, params],
    queryFn: () => freeEsimBookingServices.getListFreeEsimBooking(params),
  });
};
