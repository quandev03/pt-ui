import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../constants/query-key';
import { globalService } from '../services';

export const useGetParamsOption = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PARAMS_OPTIONS],
    queryFn: () => globalService.getParamsOption(),
  });
};
