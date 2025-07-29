import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ProductCatalog } from '../../ProductCatalog/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export interface ProductRequest {
  valueSearch?: string;
  productCategoryType?: string;
  checkSerial?: number;
  page: number;
  size: number;
  queryKey?: string;
}

export const queryKeyListProduct = 'query-list-choose-products';

const fetcher = (payload: ProductRequest) => {
  const { page, size, ...rest } = payload;
  return axiosClient.post<ProductRequest, IPage<ProductCatalog>>(
    `${prefixCatalogService}/product/choose-products`,
    rest,
    {
      params: { page, size },
    }
  );
};

export const useListProduct = (
  payload: ProductRequest,
  isOpen: boolean = true
) => {
  return useQuery({
    queryFn: () => fetcher(payload),
    queryKey: [queryKeyListProduct, payload, isOpen],
    enabled: isOpen,
  });
};

export const useMutateListProduct = () => {
  return useMutation({
    mutationFn: async (keySearch: string) => {
      const res = await fetcher({
        valueSearch: keySearch,
        checkSerial: 1, //have check serial
        page: 0,
        size: 20,
      });
      return res?.content?.map((e) => ({
        ...e,
        value: e.id,
        label: e?.productName,
      }));
    },
  });
};
