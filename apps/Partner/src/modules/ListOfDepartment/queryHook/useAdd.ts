import { NotificationSuccess } from '@react/commons/Notification';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { prefixCatalogServicePublic } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { axiosClient } from 'apps/Partner/src/service';
import { useNavigate } from 'react-router-dom';

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
}

const addApi = (data: ItemEdit) => {
  return axiosClient.post<any>(
    `${prefixCatalogServicePublic}/organization-unit`,
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
