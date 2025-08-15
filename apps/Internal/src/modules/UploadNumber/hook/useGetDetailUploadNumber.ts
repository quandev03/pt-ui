import { safeApiClient } from 'apps/Internal/src/services';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { urlUploadNumber } from '../services/url';
import { IResponseUploadNumber } from '../types';

const fetcher = async (id: string) => {
  const res = await safeApiClient.get<IResponseUploadNumber>(
    `${urlUploadNumber}/${id}`
  );
  return res;
};
const useGetDetailUploadNumber = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_UPLOAD_NUMBER, id],
    queryFn: () => fetcher(id),
    enabled: !!id,
  });
};
export default useGetDetailUploadNumber;
