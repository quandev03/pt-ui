import { NotificationSuccess } from '@react/commons/Notification';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import urlPromotionProgramBusiness from '../services/url';
import { IPayload } from '../types';
import { queryKeyList } from './useList';

const fetcher = async (data: IPayload) => {
  const res = await axiosClient.put<string, IPayload>(
    `${urlPromotionProgramBusiness}/${data.id}`,
    data
  );
  return res;
};

const useEdit = (onSuccess: () => void, form: FormInstance) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyList] });
      NotificationSuccess(MESSAGE.G02);
      onSuccess && onSuccess();
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
  });
};
export default useEdit;
