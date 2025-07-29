import { prefixSaleService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreListOfRequestsChangeSim from '../store';
import { CommonError } from '@react/commons/types';
import groupBy from 'lodash/groupBy';
import { v4 } from 'uuid';
import { useWatch } from 'antd/es/form/Form';
export interface ParamSerialList {
  stockId: string;
  simType: string;
}

const fetcher = (params: ParamSerialList) => {
  return axiosClient.post<any, any>(
    `${prefixSaleService}/sale-request/calc-fee`,
    {
      serviceType: 'CHANGE_SIM',
      data: params,
    }
  );
};
export const useSerialNew = () => {
  const { formAntd, setLpd } = useStoreListOfRequestsChangeSim();
  const isFreeSim = formAntd?.getFieldValue("isFreeSim");
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      setLpd(data?.lpd);
      formAntd.setFieldsValue({
        serial: data?.serial,
        feeAmount:isFreeSim ? 0 : data?.amountTotal,
        feeAmountCache:data?.amountTotal,
        newImsi: data?.imsi,
        lpaData: data?.lpa,
        enableResetSerial: false,
      });
    },
    onError: (err: CommonError, variables) => {
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

      formAntd.setFieldsValue({
        uuid: v4(),
        serial: '',
        feeAmount: '',
        feeAmountCache: '',
        newImsi: '',
        lpaData: '',
      });
    },
  });
};
