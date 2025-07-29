import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ISupplierItem, ISupplierParams } from '../../Supplier/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export const queryKeyGetSaleSupplier = 'query-get-sale-supplier';

const fetcher = (params?: ISupplierParams) => {
  return axiosClient.get<ISupplierParams, IPage<ISupplierItem>>(
    `${prefixCatalogService}/supplier`,
    {
      params,
    }
  );
};

export const useListSupplier = () => {
  return useMutation({
    mutationFn: (keySearch: string) =>
      fetcher({
        'search-string': keySearch,
        status: 1,
        page: 0,
        size: 20,
      }).then(
        (res) =>
          res?.content?.map((e) => ({
            ...e,
            value: e.id,
            label: e.supplierName,
          })) ?? []
      ),
  });
};
