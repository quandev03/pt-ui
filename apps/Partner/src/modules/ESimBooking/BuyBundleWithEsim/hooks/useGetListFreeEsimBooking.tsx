import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../../constants/query-key';
import { IParamsRequest } from '@vissoft-react/common';
import { packagedEsimBookingServices } from '../services';

export const useGetListPackagedsimBooking = (params: IParamsRequest) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PACKAGED_ESIM, params],
    queryFn: () => packagedEsimBookingServices.getListFreeEsimBooking(params),
  });
};
