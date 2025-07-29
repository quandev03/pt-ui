import { useQuery } from "@tanstack/react-query"
import { prefixCatalogService } from "apps/Internal/src/constants/app"
import { axiosClient } from "apps/Internal/src/service"
const queryKey = ['getTypeAtrribute']
const fetcher = async () => {
    const res = await axiosClient.get<any, any>(`${prefixCatalogService}/product-category/combobox/attribute-type`)
    return res
}
const useGetTypeAtrribute = () => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: fetcher,
        select: (data) => {
            return data.filter((item: any) => {
                return item.status === 1;
            })
        }
    })
}
export default useGetTypeAtrribute
