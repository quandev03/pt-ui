import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useActivateM2M from '../store';

const fetcher = (id: string) => {
  return axiosClient.get<any>(
    `${prefixCustomerService}/authorized-person/search`,
    {
      params: {
        enterpriseId: id,
      },
    }
  );
};

export const useSubsList = (onSuccess: (data: any) => void) => {
  const { setListSub } = useActivateM2M();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      const filteredData = data?.content?.filter(
        (item: any) => item.status !== 0
      );
      console.log("DTAATATTA ", filteredData);
      
      setListSub(filteredData);
      onSuccess(data);
    },
    //   onError: (err: CommonError) => {

    //   },
  });
};
