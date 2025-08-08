import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../../constants/query-key';
import { freeEsimBookingServices } from '../services';
import { IParamsRequest } from '@vissoft-react/common';

export const useGetListFreeEsimBooking = (params: IParamsRequest) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_FREE_ESIM_BOOKING, params],
    queryFn: () => freeEsimBookingServices.getListFreeEsimBooking(params),
  });
};
