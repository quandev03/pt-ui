import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../constants/query-key';
import { convertArrToObj, globalService } from '../services';
import { AnyElement } from '@vissoft-react/common';
const mapStockParent = (stocks: AnyElement) => {
  return stocks?.map((item: AnyElement) => ({
    title: item.orgName,
    value: item.id,
    children: mapStockParent(item.children),
  }));
};

export const useGetAgencyOptions = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY, params],
    queryFn: () => globalService.getAgencies(params),
    select(data) {
      return mapStockParent(convertArrToObj(data, null));
    },
  });
};
