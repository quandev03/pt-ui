import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ProductCatalog } from '../../ProductCatalog/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export interface ProductRequest {
    valueSearch?: string;
    productCategoryType?: string;
    page: number;
    size: number;
    onlyChooseSim?: boolean;
}

export const queryKeyListProduct = 'QUERY_LIST_PRODUCT';

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

export const useListProduct = (payload: ProductRequest) => {
    return useQuery({
        queryFn: () => fetcher(payload),
        queryKey: [queryKeyListProduct, payload],
    });
};

export const useMutateListProduct = () => {
    return useMutation({
        mutationFn: async (keySearch: string) => {
            const res = await fetcher({
                valueSearch: keySearch,
                page: 0,
                size: 20,
                onlyChooseSim: false,
            });
            return res?.content?.map((e) => ({
                ...e,
                value: e.productCode,
                label: e?.productCode,
            }));
        },
    });
};
