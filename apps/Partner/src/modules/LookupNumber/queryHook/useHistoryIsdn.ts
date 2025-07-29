import { IParamsRequest } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constant';
import { getHistoryIsdn } from '../services';
export const useHistoryIsdn = (
  isdn: string,
  params?: IParamsRequest & { from: string; to: string }
) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_HISTORY_ISDN, isdn, params],
    queryFn: () => getHistoryIsdn(isdn, params),
    enabled: !!isdn,
    select: (data: any) => {
      return data.content;
    },
  });
};
