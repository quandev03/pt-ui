import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from '@react/url/app';
import { ISerialType } from '../types';
import { axiosClient } from 'apps/Partner/src/service';
const urlFilterSerial = `${prefixSaleService}/stock-product/auto-filter-serial`
const postFilterSerial = (data: {
    productId: number,
    fromSerial?: number,
    quantity?: number,
    orgId: number,
    type: number
  }
) => {
    return axiosClient.post<string, ISerialType[]>(urlFilterSerial, [data]);
};
export const useAutoFilterSerial = (onSuccess: (data: ISerialType[]) => void) => {
    return useMutation({
        mutationFn: postFilterSerial,
        onSuccess: (data) => {
            onSuccess(data);
        }
    });
};
