import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from './key';
import { getNumber } from '../services';

export const useGetNumber = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_NUMBER],
    queryFn: getNumber,
    select: (data: any) => {
      return data.content;
    },
  });
};
