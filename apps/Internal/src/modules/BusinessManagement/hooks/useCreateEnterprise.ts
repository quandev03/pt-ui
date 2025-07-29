import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreBusinessManagement from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useNavigate } from 'react-router-dom';
import { NotificationSuccess } from '@react/commons/Notification';
import { CommonError } from '@react/commons/types';
import groupBy from 'lodash/groupBy';

export interface Req {
  requestId: string;
}

interface Res {
  data: any;
}

const fetcher = (files: any) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key] && key !== 'id') {
      formData.append(key, files[key] as Blob);
    }
  });
  if (files?.id) {
    return axiosClient.put<Req, Res>(
      `${prefixCustomerService}/enterprise/update-erp/${files.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  } else {
    return axiosClient.post<Req, Res>(
      `${prefixCustomerService}/enterprise`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
};

export const useCreateEnterprise = () => {
  const { formAntd } = useStoreBusinessManagement();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, variables) => {
      if (variables.id) {
        NotificationSuccess('Cập nhật thành công');
      } else {
        NotificationSuccess('Thêm mới thành công');
      }

      if (formAntd.getFieldValue('saveForm') === true) {
        formAntd.resetFields();
      } else {
        navigate(-1);
      }
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        formAntd.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
    },
  });
};
