import { IParamsRequest } from '@react/commons/types';
import { prefixCatalogServicePublic } from '@react/url/app';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IParamsOrgPartner } from '../type';

const queryKeyList = 'list-partners';
const fetcher = async (params: IParamsOrgPartner) => {
    const res = await axiosClient.get<any, any>(
        `${prefixCatalogServicePublic}/organization-partner`, {
        params: params
    }
    );
    return res;
};
export const useListPartner = (params: IParamsOrgPartner) => {
    return useInfiniteQuery({
        queryKey: [queryKeyList, params],
        initialPageParam: 0,
        queryFn: ({ pageParam = 0 }) => {
            return fetcher({ ...params, page: pageParam });
        },
        select: (data) => {
            const { pages } = data;
            const result: any[] = [];
            pages.forEach((item) => {
                item.content.forEach((product: any) => {
                    result.push(product);
                });
            });
            return result.map((items) => {
                return {
                    value: items.id,
                    label: items.orgName,
                };
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.last) {
                return undefined;
            }
            return lastPage.number + 1;
        },
    });
};
export default useListPartner;
