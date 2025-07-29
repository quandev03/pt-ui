import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface IProducts {
  createdBy: any;
  createdDate: any;
  modifiedBy: any;
  modifiedDate: any;
  id: number;
  parentId: number;
  productCode: string;
  productName: string;
  productUom: any;
  productUomValue: any;
  productStatus: any;
  categoryName: any;
  productType: any;
  children: any;
}

const queryKeyListProducts = 'query-list-products';
const fetcher = (params?: Record<string, string | number>) => {
  return axiosClient.get<string, IProducts[]>(
    `${prefixCatalogService}/product/products`,
    { params }
  );
};

export const useFetchProducts = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: [queryKeyListProducts, params],
    queryFn: () => fetcher(params),
    select: (data) => {
      if (!data) return [];
      return data.map((item: any) => {
        return {
          label: item.productName,
          value: item.id,
        };
      });
    },
  });
};
