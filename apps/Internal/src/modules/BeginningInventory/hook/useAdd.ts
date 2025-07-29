import { axiosClient } from "apps/Internal/src/service";
import { urlBeginningInventory } from "../services";
import { useMutation } from "@tanstack/react-query";
import { NotificationSuccess } from "@react/commons/Notification";
export interface IAddBeginningInventory {
    orgId: number;
    endDate: string;
    productInventories: Array<{
        productCode: string;
        quantity: number;
    }>;
}
const fetcher = async (data: IAddBeginningInventory) => {
    const res = await axiosClient.post(urlBeginningInventory, data);
    return res
};
const useAdd = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: () => {
            NotificationSuccess('Thêm mới thành công');
            onSuccess && onSuccess();
        },
    });
};
export default useAdd;
