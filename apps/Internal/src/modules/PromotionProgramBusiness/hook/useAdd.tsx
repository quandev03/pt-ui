import { NotificationSuccess } from '@react/commons/Notification';
import { AnyElement, CommonError, FieldErrorsType } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import urlPromotionProgramBusiness from '../services/url';
import { IPayload } from '../types';
import { queryKeyList } from './useList';
const fetcher = async (data: IPayload) => {
    const res = await axiosClient.post<string, IPayload>(`${urlPromotionProgramBusiness}`, data)
    return res
}
const useAdd = (onSuccess: (data:AnyElement) => void, form: FormInstance) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [queryKeyList] })
            NotificationSuccess(MESSAGE.G01)
            onSuccess && onSuccess(data)
        },
        onError: (err: CommonError) => {
            if (err?.errors?.length > 0) {
                form.setFields(
                    err?.errors?.map((item: FieldErrorsType) => ({
                        name: item.field,
                        errors: [item.detail],
                    }))
                );
            }
        },
    })
}
export default useAdd;
