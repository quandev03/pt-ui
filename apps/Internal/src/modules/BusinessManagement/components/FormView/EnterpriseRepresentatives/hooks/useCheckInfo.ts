import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import { groupBy } from 'lodash';
import useRepresentativeStore from '../store';

type Req = {
  id: string;
  name: string;
  birthday: string;
  document: string;
  id_ekyc: string;
};
const checkInfo = (data: Req) => {
  return axiosClient.post<Req, any>(
    `${prefixCustomerService}/enterprise/check-c06-info`,
    data
  );
};
export const useCheckInfo = (form: FormInstance) => {
  const { setIsDisableCheckInfo, setIsAllowSave } = useRepresentativeStore();
  return useMutation({
    mutationFn: checkInfo,
    onSuccess: () => {
      setIsDisableCheckInfo(true);
      setIsAllowSave(true);
      NotificationSuccess('Xác thực thông tin thành công');
    },
    onError: (err: IErrorResponse) => {
      if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        form.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      } else {
        NotificationError(err.detail);
      }
    },
  });
};
