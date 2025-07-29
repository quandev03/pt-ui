import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { versionApi } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { ILockPeriod, IPayload } from '../type';
import { queryKey } from './useList';
import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
const url = 'sale-service/private/api' + versionApi;
interface Response {
  content: ILockPeriod[];
  totalElements:number
}
const fetcher = async (data: IPayload) => {
  const res = axiosClient.put<ILockPeriod, Response>(
    `${url}/stock-period/update-cycle-inventory?endDate=${data.endDate}&status=${data.status}`
  );
  return res;
};
export const useEdit = (onSuccess?:()=>void)=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:fetcher,
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: [queryKey]
            })
            onSuccess?.();
        }
    })
}