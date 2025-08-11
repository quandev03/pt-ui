import { useQuery } from '@tanstack/react-query';
import { getHistoryIsdn } from '../services';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { IParamsRequest } from '@vissoft-react/common';
export const useHistoryIsdn = (
  isdn: string,
  params?: IParamsRequest & { from: string; to: string }
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_HISTORY_ISDN, isdn, params],
    queryFn: () => getHistoryIsdn(isdn, params),
    enabled: !!isdn,
  });
};
