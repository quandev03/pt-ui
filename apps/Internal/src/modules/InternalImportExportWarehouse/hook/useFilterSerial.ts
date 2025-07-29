import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
const urlFilterSerial = `${prefixSaleService}/stock-product/auto-filter-serial`
const postFilterSerial = (data: any) => {
    return axiosClient.post<string, any>(urlFilterSerial, data);
};
export const useFilterSerial = (onSuccess: (data: any) => void) => {
    return useMutation({
        mutationFn: postFilterSerial,
        onSuccess: (data) => {
            onSuccess(data);
        },
        onError: (error: any) => {
            throw error;
        },
    });
};
