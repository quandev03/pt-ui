import { IPage, IParamsRequest } from '@react/commons/types';
import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export interface IGetStockIsdnParams extends IParamsRequest {
  stockId: string;
  isdn?: string;
}
export interface IStockIsdn {
  id: number;
  isdn: number;
  generalFormat: string;
  groupCode: string;
}

const fetcher = (payload: IGetStockIsdnParams) => {
  const { stockId, ...params } = payload;
  return axiosClient.get<string, IPage<IStockIsdn>>(
    `${prefixResourceService}/lookup-number/in-stock/${stockId}`,
    { params: { ...params, page: params.page - 1 } }
  );
};

const useGetStockIsdn = (params: IGetStockIsdnParams) => {
  return useQuery({
    queryKey: ['useGetStockIsdnKey', params],
    queryFn: () => fetcher(params),
    enabled: !!params.stockId,
  });
};
export default useGetStockIsdn;
