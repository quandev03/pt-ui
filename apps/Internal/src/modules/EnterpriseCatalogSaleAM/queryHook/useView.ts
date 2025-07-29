import { useMutation, useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useActiveSubscriptStore } from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const fetcher = async (id: string) => {
  return await axiosClient.get<any, any>(
    `${prefixCustomerService}/subscriber-request` + `/${id}`
  );
};
export const queryKeyActivationRequest = 'query-activation-request';

export const useView = (onssucess: (data: any) => void) => {
  const {
    setDataActivationRequest,
    formAntd,
    // formAntd
  } = useActiveSubscriptStore();
  // return useQuery({
  //   queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_REQUEST_LIST, params],
  //   queryFn: () => fetcher(params),
  //   select: (data: any) => data,
  // });
  return useMutation({
    mutationKey: [queryKeyActivationRequest],
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      console.log(data);

      onssucess(data);
      // setDataActivationRequest(data);
      // formAntd?.setFieldValue("isdn", data.isdn)
      // formAntd.setFieldsValue({
      //   ...data,
      //   // issue_date: dayjs(data.issue_date, DateFormat.DEFAULT_V4),
      //   // expiry: dayjs(data.expiry, DateFormat.DEFAULT_V4),
      //   // birthday: dayjs(data.birthday, DateFormat.DEFAULT_V4),
      // });
    },
  });
};
