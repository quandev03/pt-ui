import { DeliveryOrderType } from "@react/constants/app";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
import { urlInternalWarehouseDeliveryNote } from "../services/url";

const fetcher = (body: any) => {
    return axiosClient.get<any, any>(
        `${urlInternalWarehouseDeliveryNote}/find-ticket-outs-for-creating-ticket-in`,
        { params: body }
    );
};

export const useGetFilterDeliveryNoteExport = (onSuccess: (data: any) => void) => {
    return useMutation({
        mutationFn: async (keySearch: string) => {
            const res = await fetcher({
                "value-search": keySearch,
                "delivery-note-type": DeliveryOrderType.INTERNAL,
                page: 0,
                size: 20
            });
            return res?.map((e: any) => ({
                ...e,
                value: e.id,
                label: e?.deliveryNoteCode,
            }));
        },
        onSuccess: (data) => {
            onSuccess && onSuccess(data)
        }
    });
};