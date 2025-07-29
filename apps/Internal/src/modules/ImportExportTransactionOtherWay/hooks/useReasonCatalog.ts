import { useQuery } from '@tanstack/react-query';
import { getCatalogReason } from '../services';
import { QUERY_KEY } from './key';

export const useGetReasonCatalog = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_CATALOG_REASON],
    queryFn: getCatalogReason,
    select: (data) => {
      return data.map((item) => ({
        label: `${item.reasonCode} (${item.reasonName})`,
        value: item.reasonId,
      }));
    },
  });
};
