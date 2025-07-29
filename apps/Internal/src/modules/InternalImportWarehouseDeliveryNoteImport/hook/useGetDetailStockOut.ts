import { prefixCatalogService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
const fetcher = async (id: string) => {
    const dataDetailStockIn = await axiosClient.get<any, any>(`${prefixCatalogService}/organization-unit/${id}`);
    return dataDetailStockIn;
};
const useGetDetailStockOut = (onSuccess?: (data: any) => void) => {
    return useMutation({
        mutationFn: (id: string) => fetcher(id),
        onSuccess: (data) => {
            onSuccess?.(data)
        }
    })
}
export default useGetDetailStockOut
