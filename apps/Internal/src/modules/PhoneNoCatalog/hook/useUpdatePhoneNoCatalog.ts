import { axiosClient } from 'apps/Internal/src/service';
import { urlphoneNoCatalog } from '../services/url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationSuccess } from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { MESSAGE } from '@react/utils/message';
import { IDataPayloadPhoneNoCatalog } from '../type';
import { FormInstance } from 'antd';
import { CommonError, FieldErrorsType } from '@react/commons/types';

const fetcher = async (data: IDataPayloadPhoneNoCatalog) => {
  const res = await axiosClient.put(`${urlphoneNoCatalog}/${data.id}`, data);
  return res;
};
const useUpdatephoneNoCatalog = (
  onSuccess: () => void,
  form: FormInstance<any>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_WAREHOUSE_CATALOG],
      });
      NotificationSuccess(MESSAGE.G02);
      onSuccess();
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
export default useUpdatephoneNoCatalog;
