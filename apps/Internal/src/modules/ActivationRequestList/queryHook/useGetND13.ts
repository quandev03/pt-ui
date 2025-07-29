import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';
import { FormInstance } from 'antd';

const fetcher = async (contractNo: string) => {
  return await axiosClient.get<any,Blob>(`${prefixCustomerService}/contract-decree/view-after/${contractNo}`,
    {
      responseType: 'blob',
    }
  );
};

export const useGetND13 = (form: FormInstance, enabled:boolean)  => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ND13, form],
    enabled: !!form.getFieldValue("contractNo") && enabled,
    queryFn: () => fetcher(form.getFieldValue("contractNo")),
    select: (data: any) => data,
  });
};
