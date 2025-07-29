import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { NotificationSuccess } from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { FormInstance } from 'antd';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import {
  prefixCatalogService,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

export interface ItemPost {
  userId: string;
  positionCode: number;
  username: string;
  fullname: string;
  phoneNumber: string;
  email: string;
}

const addApi = (arr: ItemPost[]) => {
  return axiosClient.post<any>(`${prefixCustomerService}/sale-employee`, arr);
};

export const useAddSale = (form: FormInstance) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  console.log("FORM CHECKKKKKKKKKKKKK ", form.getFieldValue('saveForm') === true);
  
  return useMutation({
    mutationFn: addApi, 
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_USERS],
      });
      NotificationSuccess('Thêm mới thành công!');
      if (form.getFieldValue('saveForm') === true) {
        navigate(pathRoutes.catalogSaleandAM);
      }
      form.resetFields()
    },
  });
};
