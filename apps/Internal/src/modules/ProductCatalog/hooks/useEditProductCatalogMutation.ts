import { NotificationSuccess } from '@react/commons/Notification';
import { AnyElement, CommonError } from '@react/commons/types';
import { mapApiErrorToForm } from '@react/helpers/utils';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';
import { AttributeType } from '../types';

const fetcher = ({ id, data }: any) => {
  return axiosClient.put(`${prefixCatalogService}/product/${id}`, data);
};

export const useEditProductCatalogMutation = (form: FormInstance) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PRODUCT_CATALOG],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_PRODUCT_CATALOG],
      });
      NotificationSuccess(MESSAGE.G02);
      navigate(-1);
    },
    onError: (error: CommonError) => {
      if (error.code === "CAT92117") {
        const formData = form.getFieldValue("attributeValueList")
        const indexSkuid = formData.findIndex((item: AnyElement) => item.attributeType === AttributeType.SKUID)
        const indexSoNgaySuDung = formData.findIndex((item: AnyElement) => item.attributeType === AttributeType.SO_NGAY_SU_DUNG)
        form.setFields([
          {
            name: ["attributeValueList", indexSkuid, "attributeValueObj"],
            errors: [error.errors[0].detail],
          },
          {
            name: ["attributeValueList", indexSoNgaySuDung, "attributeValueObj"],
            errors: [error.errors[0].detail],
          },
        ]);
      }
      mapApiErrorToForm(form, error.errors)
    },
  });
};
