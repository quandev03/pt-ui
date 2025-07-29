import { useQuery } from "@tanstack/react-query";
import { prefixSaleService } from "apps/Internal/src/constants/app";
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys";
import { axiosClient } from "apps/Internal/src/service";
import { IWarehouseExport } from "../type";

const fetcher = async () => {
  const res = await axiosClient.get<IWarehouseExport, any>(`${prefixSaleService}/organization-user/get-organization-current`);
  return res
}
const useGetWarehouseExport = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_WAREHOUSE_EXPORT],
    queryFn: fetcher,
    select: (data) => data,
  });
};
export default useGetWarehouseExport;
