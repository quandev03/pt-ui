import { CommonError } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { groupBy } from 'lodash';
import useStoreListOfRequestsChangeSim from '../store';

export interface ParamCheck5Numbers {
  isdn: string;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;
  phoneNumber4: string;
  phoneNumber5: string;
}

const fetcher = (data: ParamCheck5Numbers) => {
  const params = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== '')
  );

  return axiosClient.post<any, any>(
    `${prefixCustomerService}/change-sim/check-5-numbers`,
    params
  );
};
export const useCheck5Numbers = () => {
  const { formAntd } = useStoreListOfRequestsChangeSim();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res, variables) => {
      formAntd.setFieldValue('variables', variables);
    },
    onError: (err: CommonError, variables) => {
      if (err?.errors?.length > 0) {
        formAntd.setFieldValue('variables', variables);
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
