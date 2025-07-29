import { DeliveryOrderMethod, DeliveryOrderType } from "@react/constants/app";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
import { urlInternalWarehouseDeliveryNote } from "../../InternalExportWarehouseDeliveryNote/services/url";
import { DeliveryOrderStatusList } from "@react/constants/status";

const fetcher = (body: any) => {
    return axiosClient.get<any, any>(
        `${urlInternalWarehouseDeliveryNote}`,
        { params: body }
    );
};

export const useGetFilterDeliveryNoteImportSearch = (onSuccess: (data: any) => void) => {
    return useMutation({
        mutationFn: async (keySearch: string) => {
            const res = await fetcher({
                q: keySearch,
                deliveryNoteMethod: DeliveryOrderMethod.IMPORT,
                deliveryNoteStatus: DeliveryOrderStatusList.CREATE,
                deliveryNoteType: DeliveryOrderType.INTERNAL,
            });
            return res?.content?.map((e: any) => ({
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