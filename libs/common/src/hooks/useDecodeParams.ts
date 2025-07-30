import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from '../utils';

export const useDecodeParams = () => {
  const [searchParams] = useSearchParams();
  const params = useMemo(
    () => decodeSearchParams(searchParams),
    [searchParams]
  );
  return params;
};
