import { prefixCustomerService } from "@react/url/app";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
const queryKey = 'check-black-list';
const fetch = async () => {
  const response = await axiosClient.get(`${prefixCustomerService}/black-list-action/check-action?action=OCR`);
  return response.data;
};

export const useCheckBlackList = () => {
   return useQuery({
    queryKey: [queryKey],
    queryFn: fetch,
   })
};

export default useCheckBlackList;
