import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

type Resp = {
  id: number;
  code: string;
  value: string;
};

const fetcher = async (tableName: string, columnName: string) => {
  const res = await axiosClient.get<any, Resp[]>(
    `${prefixCatalogService}/parameter?table-name=${tableName}&column-name=${columnName}`
  );
  return res;
};
export const useGetDataAppPickList = (
  tableName: string,
  columnName: string
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_APPROVAL_STATUS, tableName, columnName],
    queryFn: () => fetcher(tableName, columnName),
    select(data) {
      const results: { label: string; value: number }[] = [];
      data.forEach((stt) => {
        results.push({ label: stt.value, value: +stt.code });
      });
      return results;
    },
  });
};
