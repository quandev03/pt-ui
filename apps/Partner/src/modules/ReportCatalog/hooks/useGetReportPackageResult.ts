import { AnyElement } from "@react/commons/types";
import { prefixSaleService } from "@react/url/app";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "apps/Partner/src/service";
import dayjs from "dayjs";

export const REPORT_PACKAGE_RESULT_QUERY_KEY = 'get-report-package-result_list';
export interface IParamsPackageResultReport {
  startDate:string;
  endDate: string;
  page:number;
  size:number;
  q?:string;
}
const fetcher = async (params: IParamsPackageResultReport) => {
        const customParams = {
          startDate: params.startDate ? dayjs(params.startDate).startOf('day').toISOString() : dayjs().subtract(29, 'day').startOf('day').toISOString(),
          endDate: params.endDate ? dayjs(params.endDate).endOf('day').toISOString() : dayjs().endOf('day').toISOString(),
          page:params.page,
          size:params.size,
          q:params.q
        }
        const res = await axiosClient.get<string,AnyElement>(`${prefixSaleService}/batch-package-sale/search`, { 
          params: customParams
         });
        return res
}
const useGetReportPackageResult = (params:IParamsPackageResultReport) => {
  return useQuery({
    queryKey: [REPORT_PACKAGE_RESULT_QUERY_KEY, params],
    queryFn: () => fetcher(params),
  })
};
export default useGetReportPackageResult