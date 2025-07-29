import { IPage } from '@react/commons/types';
import { prefixSaleService } from '@react/url/app';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export type ProductCatalog = {
  id: number;
  parentId: number;
  productCode: string;
  productName: string;
  productUom: string;
  categoryName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  children: ProductCatalog[];
  checkSerial?: boolean;
};

export interface ProductRequest {
  valueSearch?: string;
  page?: number;
  size?: number;
  orgId?: string;
  productCategoryId?: string;
}

export const queryKeyListProduct = 'query-list-choose-products';
const fetcher = (payload: ProductRequest) => {
  const { page, size, orgId, ...rest } = payload;
  return axiosClient.get<ProductRequest, IPage<ProductCatalog>>(
    `${prefixSaleService}/transfer-stock-move/search-transferring-product/${orgId}`,
    {
      params: {
        ...rest,
        page,
        size,
      },
    }
  );
};

export const useListProduct = (payload: ProductRequest, isOpen: boolean) => {
  return useQuery({
    queryFn: () => fetcher(payload),
    queryKey: [queryKeyListProduct, payload, isOpen],
    enabled: !!isOpen,
  });
};
export const useMutateListProduct = () => {
  return useMutation({
    mutationFn: async (keySearch: string) => {
      const res = await fetcher({
        valueSearch: keySearch,
        page: 0,
        size: 20,
      });
      return res?.content?.map((e) => ({
        ...e,
        value: e.id,
        label: e?.productCode,
      }));
    },
  });
};
