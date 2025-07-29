import { prefixCatalogService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = () => {
  return axiosClient.get<any, string[]>(
    `/${prefixCatalogService}/isdn-prefix/all-prefix`
  );
};

export const usePrefixIsdnQuery = () => {
  return useQuery({
    queryFn: fetcher,
    queryKey: ['GET_ALL_PREFIX_ISDN'],
    select(data) {
      const newData = data
        .map((item) => item.replace(/0(\d+)/, '$1'))
        ?.join('|');
      const prefixIsdn = new RegExp(`^0?(${newData})`);
      return prefixIsdn;
    },
  });
};
