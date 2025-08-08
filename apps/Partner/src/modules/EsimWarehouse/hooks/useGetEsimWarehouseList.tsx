import { useQuery } from '@tanstack/react-query';
import { IParamsRequest } from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { esimWarehouseServices } from '../services';

export const useGetEsimWarehouseList = (params: IParamsRequest) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ESIM_WAREHOUSE_LIST, params],
    queryFn: () => {
      return esimWarehouseServices.getEsimWarehouseList(params);
    },
  });
};
