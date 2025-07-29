import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ProductCatalog } from '../../ProductCatalog/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { ICategoryProducts } from '../type';
import useStoreInternalExportProposal from '../store';

export interface ProductRequest {
    valueSearch?: string;
    categoryTypes?: string[];
    page: number;
    size: number;
    categoryIds?:string[];
    orgIds?:string[];
}

export const queryKeyListProduct = 'QUERY_LIST_PRODUCT';
const fetcher = (payload: ProductRequest) => {
    const { page, size, ...rest } = payload;
    return axiosClient.post<ProductRequest, IPage<ProductCatalog>>(
        `${prefixCatalogService}/product/search-products-for-import-or-export`,
        rest,
        {
            params: { page, size },
        }
    );
};

export const useListProduct = (payload: ProductRequest,enabled?:boolean) => {
    return useQuery({
        queryFn: () => fetcher(payload),
        queryKey: [queryKeyListProduct, payload],
        enabled: enabled,
    });
};

export const useMutateListProduct = () => {
    const {orgIds} = useStoreInternalExportProposal();
    return useMutation({
        mutationFn: async (keySearch: string) => {
            if(orgIds){
                const res = await fetcher({
                    valueSearch: keySearch,
                    page: 0,
                    size: 20,
                    orgIds: [orgIds],
                    categoryTypes: [ICategoryProducts.ESIM, ICategoryProducts.KIT, ICategoryProducts.SIM_VAT_LY],
                });
                return res?.content?.map((e) => ({
                    ...e,
                    value: e.id,
                    label: e?.productName,
                }));
            }
            return [];
        },
    });
};
