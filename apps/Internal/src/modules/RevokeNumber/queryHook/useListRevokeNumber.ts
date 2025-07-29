import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { urlRevokeNumber } from '../services';
import { IPramsRecallNumber } from '../types';
import { formatDate } from '@react/constants/moment';
import dayjs from 'dayjs';

  const fetcher = (params: IPramsRecallNumber) => {
  const from = params.from ? dayjs(params.from, formatDate).startOf('day').format("YYYY-MM-DDTHH:mm:ss") : dayjs().subtract(29, 'day').startOf('day').format("YYYY-MM-DDTHH:mm:ss");
  const to = params.to ? dayjs(params.to, formatDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss") : dayjs().endOf('day').format("YYYY-MM-DDTHH:mm:ss");
  const customParams = {
    ...params,
    "from-date": from,
    "to-date": to
  }
  return axiosClient.get<any, any>(urlRevokeNumber, { params: customParams });
};

export const useListRevokeNumber = (params: IPramsRecallNumber) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_REVOKE_NUMBER, params],
    queryFn: () => fetcher(params),
    select: (data) => data
  });
};
