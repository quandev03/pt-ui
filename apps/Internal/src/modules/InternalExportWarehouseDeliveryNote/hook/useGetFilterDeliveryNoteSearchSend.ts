import { DeliveryOrderMethod, DeliveryOrderType } from "@react/constants/app";
import { DeliveryOrderApprovalStatusList } from "@react/constants/status";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";

const fetcher = (body: any) => {
    return axiosClient.post<any, any>(
        `sale-service/public/api/v1/delivery-order/search?page=0&size=20`,
        body
    );
};

export const useGetFilterDeliveryNoteSearchSend = (onSuccess: (data: any) => void) => {
    return useMutation({
        mutationFn: async (keySearch: string) => {
            const res = await fetcher({
                q: keySearch,
                orderStatusList: [
                    DeliveryOrderType.INTERNAL, DeliveryOrderType.PARTNER
                ],
                approvalStatus: DeliveryOrderApprovalStatusList.APPROVED,
                deliveryOrderType: DeliveryOrderType.INTERNAL,
                deliveryNoteMethod: DeliveryOrderMethod.RETURN,
                deliveryOrderMethod: DeliveryOrderMethod.RETURN
            });
            return res?.content?.map((e: any) => ({
                ...e,
                value: e.id,
                label: e?.orderNo,
            }));
        },
        onSuccess: (data) => {
            onSuccess && onSuccess(data)
        }
    });
};