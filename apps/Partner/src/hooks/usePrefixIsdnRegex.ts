import { AnyElement, MESSAGE } from '@vissoft-react/common';
import { axiosClient } from '../services';
import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService } from '../constants';
const fetcher = () => {
  return axiosClient.get<AnyElement, string[]>(
    `/${prefixCatalogService}/isdn-prefix/all-prefix`
  );
};

export const usePrefixIsdnQuery = () => {
  return useQuery({
    queryFn: fetcher,
    queryKey: ['GET_ALL_PREFIX_ISDN'],
    staleTime: Infinity,
  });
};
export const usePrefixIsdnRegex = () => {
  const { data = [] } = usePrefixIsdnQuery();
  const newData = data
    ?.map((item) => (item[0] === '0' ? item.substring(1) : item))
    ?.join('|');

  const prefixIsdn = new RegExp(`^0?(${newData})`);

  return {
    validator: (_: AnyElement, value: string) => {
      const newValue = value?.toString()?.replace(/\D/g, '');
      if (newValue) {
        if (newValue.length < 9) {
          return Promise.reject(new Error(MESSAGE.G07));
        }
        if (!prefixIsdn.test(newValue)) {
          return Promise.reject(new Error('Đầu số không thuộc nhà mạng VNSKY'));
        }
      }
      return Promise.resolve();
    },
  };
};
