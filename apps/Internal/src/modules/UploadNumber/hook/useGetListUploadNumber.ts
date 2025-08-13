import { axiosClient, safeApiClient } from 'apps/Internal/src/services';
import { urlUploadNumber } from '../services/url';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import {
  IParamsRequestUploadDigitalResources,
  IResponseUploadNumber,
} from '../types';
import dayjs from 'dayjs';
import { formatDate, IPage } from '@vissoft-react/common';

const fetcher = async (params: IParamsRequestUploadDigitalResources) => {
  delete params.status;
  delete params.date;
  const from = params.from
    ? dayjs(params.from, formatDate)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss')
    : dayjs().subtract(29, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
  const to = params.to
    ? dayjs(params.to, formatDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    : dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
  const customParams = {
    ...params,
    from,
    to,
  };
  const res = await safeApiClient.get<IPage<IResponseUploadNumber>>(
    `${urlUploadNumber}`,
    {
      params: customParams,
    }
  );
  return res;
};

const useGetListUploadNumber = (
  params: IParamsRequestUploadDigitalResources
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_NUMBER, params],
    queryFn: () => fetcher(params),
  });
};

export default useGetListUploadNumber;
