import { prefixCatalogService } from "@react/url/app"
import { useQuery } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
const queryKey = "GET_ALL_CATEGORY_PRODUCT"
export interface IProductCategory {
    categoryCode: string;
    categoryName: string;
    categoryType: number;
    categoryTypeName: string;
    createdBy: string;
    createdDate: string;
    description: string;
    id: number;
    modifiedBy: string;
    modifiedDate: string;
    productCategoryAttributeDTOS: any | null;
    status: number;
    statusName: string;
}
const fetcher = async () => {
    const res = await axiosClient.get<IProductCategory[], any>(`${prefixCatalogService}/product-category`)
    return res
}
const useGetCategoryProduct = (enabled: boolean) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: fetcher,
        select: (data) => data,
        enabled: enabled
    })
}
export default useGetCategoryProduct
