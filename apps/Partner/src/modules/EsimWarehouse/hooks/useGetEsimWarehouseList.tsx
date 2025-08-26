import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { esimWarehouseServices } from '../services';
import { IEsimWarehouseParams } from '../types';

export const useGetEsimWarehouseList = (params: IEsimWarehouseParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ESIM_WAREHOUSE_LIST, params],
    queryFn: () => {
      return esimWarehouseServices.getEsimWarehouseList(params);
    },
  });
};
