import { AnyElement } from '@react/commons/types';
import { cleanParams, decodeSearchParams } from '@react/helpers/utils';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { NavigateOptions, useSearchParams } from 'react-router-dom';

const useSearchHandler = (REACT_QUERY_KEYS: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const queryClient = useQueryClient();

  const handleSearch = (
    values: Record<string, AnyElement>,
    options?: NavigateOptions
  ) => {
    const paramsFormClean = cleanParams({
      ...params,
      ...values,
      page: 0,
    });
    const paramsClean = cleanParams({
      ...params,
    });

    if (isEqual(paramsFormClean, paramsClean)) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS],
      });
    } else {
      const searchParams = new URLSearchParams({
        ...params,
        ...values,
        page: 0,
      });
      setSearchParams(searchParams, options);
    }
  };
  return {
    handleSearch,
  };
};

export default useSearchHandler;
