import { prefixCatalogService } from '@react/url/app';
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { CoverageRangeStatus, IParamsCoverageRanges } from '../types';

const queryKeyList = 'list-coverage-ranges';

const fetcher = async (active: boolean, pageParam: number = 0, valueSearch: string = '') => {
    const params: IParamsCoverageRanges = {
        page: pageParam,
        size: active ? 20 : 9999,
        valueSearch
    }
    if (active) {
        params.status = CoverageRangeStatus.ACTIVATE;
    }
    const res = await axiosClient.get<any, any>(
        `${prefixCatalogService}/coverage-range/search`, {
        params
    }
    );
    return res;
};

export const useGetCoverageRanges = (active: boolean = false, enabled: boolean = false, valueSearch: string = '') => {
    return useInfiniteQuery({
        queryKey: [queryKeyList, active, valueSearch],
        queryFn: ({ pageParam = 0 }) => fetcher(active, pageParam, valueSearch),
        enabled,
        getNextPageParam: (lastPage) => {
            if (lastPage.last || lastPage.totalPages <= lastPage.number + 1) {
                return undefined;
            }
            return lastPage.number + 1;
        },
        initialPageParam: 0
    });
};

export default useGetCoverageRanges;
