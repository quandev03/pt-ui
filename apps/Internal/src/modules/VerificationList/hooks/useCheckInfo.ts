import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import useCensorshipStore from '../store';
import { useMutation } from '@tanstack/react-query';
import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';

type CheckInfoPayload = {
  id: string;
  birthday: string;
  issue_by: string;
  name: string;
  document: string;
  sex: string;
};
const checkInfo = (data: CheckInfoPayload) => {
  return axiosClient.post<CheckInfoPayload>(
    `${prefixCustomerService}/check-approve-info`,
    data
  );
};
export const useCheckInfo = (onSuccess?: () => void,onError?: (errorField: IFieldErrorsItem[]) => void,enableMessage: boolean = true) => {
  const { setCriteriaErrList, formAntd } = useCensorshipStore();
  return useMutation({
    mutationFn: checkInfo,
    onSuccess: () => {
      enableMessage && NotificationSuccess('Kiểm tra thông tin thành công');
      formAntd.setFieldValue('isDisableCheck', true);
      setCriteriaErrList([]);
      onSuccess?.();
    },
    onError: (err: IErrorResponse) => {
      if (err.errors.length > 0) {
        const expectedErrors = [
          "Thông tin khách hàng không thỏa mãn tiêu chí số 1: Tên thuê bao dài (trên 30 ký tự)",
          "Thông tin khách hàng không thỏa mãn tiêu chí số 2: Có cùng số GTTT nhưng khác tên thuê bao",
          "Thông tin khách hàng không thỏa mãn tiêu chí số 3: Có cùng số GTTT nhưng khác ngày sinh"
        ];
        const hasOnlyExpectedErrors = err.errors.every((error) =>
          expectedErrors.includes(error.detail)
        ); 
        if (hasOnlyExpectedErrors) {
          formAntd.setFieldValue('isDisableCheck', true);
        }
      }
      const mappedErrors = err.errors.map((error) => ({
        ...error,
        field: error.field === 'issue_by' ? 'id' : error.field
      }));
      setCriteriaErrList(mappedErrors);
      onError?.(mappedErrors);
    },
  });
};
