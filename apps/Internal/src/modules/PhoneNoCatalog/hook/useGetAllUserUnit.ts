import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
const queryKey = "GET_ALL_USER_UNIT"
const fetcher = async () => {
    const res = await axiosClient.get(`${prefixSaleService}/organization-user/get-users-root`, {
        params: {
            page: 0,
            size: 99999999,
        }
    })
    return res
}
const useGetAllUserUnit = () => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: () => fetcher(),
        select: (data: any) => data,
    });
};
export default useGetAllUserUnit;
