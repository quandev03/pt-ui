import { axiosClient } from "apps/Internal/src/service"
import { urlphoneNoCatalog } from "../services/url"
import { useQuery } from "@tanstack/react-query"
import { REACT_QUERY_KEYS } from "apps/Internal/src/constants/querykeys"
import { IListPhoneNoCatalog, IParamsPhoneNoCatalog } from "../type";
export const deleteChild = (savedArray: any[], id: any) => {
    if (!id) return savedArray;
    function filter(_target: any) {
        let toDelete: any[] = [];
        for (let i = 0; i < savedArray?.length; i++) {
            if (savedArray[i].id == _target || savedArray[i].parentId == _target) {
                toDelete.push(i);
                if (savedArray[i].id != _target) {
                    toDelete = toDelete.concat(filter(savedArray[i].id).slice(1));
                }
            }
        }
        return toDelete;
    }
    const targets = filter(id).sort();
    for (let i = targets.length - 1; i >= 0; i--) {
        savedArray.splice(targets[i], 1);
    }
    return savedArray;
};

export const convertArrToObj = (arr: any[], parent: any) => {
    let newArr = arr
        ?.filter(
            (item) =>
                item.parentId === parent ||
                (!arr?.some((val: any) => val.id === item.parentId) && parent === null)
        )
        ?.reduce((acc, item) => {
            acc.push({ ...item, children: convertArrToObj(arr, item.id) });
            return acc;
        }, []);

    return newArr?.length > 0 ? newArr : undefined;
};
const fetcher = async (params: IParamsPhoneNoCatalog) => {
    const res = await axiosClient.get<null, IListPhoneNoCatalog[]>(`${urlphoneNoCatalog}`, {
        params: {
            parentId: "-1",
            page: 0,
            size: 999999999,
            status: params.status
        }
    })
    return res
}
export const useGetListphoneNoCatalog = (params: IParamsPhoneNoCatalog) => {
    return useQuery({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_WAREHOUSE_CATALOG, params],
        queryFn: () => fetcher(params),
        select: (data: any) => data.content
    })
}