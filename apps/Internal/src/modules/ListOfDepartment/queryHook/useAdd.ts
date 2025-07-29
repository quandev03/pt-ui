import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { FormInstance } from 'antd';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';

export interface ItemEdit {
  id?: string;
  saveForm?: boolean;
  orgCode: string;
  orgName: string;
  provinceCode: string;
  districtCode: string;
  address: string;
  taxCode: string;
  representative: string;
  orgSubType: string;
  status: number;
  saleChanel: string[] | string;
  deliveryAreas: string | string[];
  email?: string[] | string;
}

const addApi = (data: ItemEdit) => {
  return axiosClient.post<any>(
    `${prefixCatalogService}/organization-unit`,
    data
  );
};

export const useAddFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: addApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_DEPARTMENT],
      });
      NotificationSuccess(MESSAGE.G01);

      if (variables.saveForm) {
        form.resetFields();
      } else {
        navigate(-1);
      }
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
