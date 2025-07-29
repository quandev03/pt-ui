import { useMutation } from "@tanstack/react-query";
import { getUnKeepIsdn } from "../services";
import { QUERY_KEY } from "../constant";
import { NotificationSuccess } from '@react/commons/index';


export const useUnKeepIsdn = () => {
    return useMutation({
        mutationFn: getUnKeepIsdn,
        mutationKey: [QUERY_KEY.GET_UN_KEEP_ISDN],
        onSuccess: (data: any) => {
            NotificationSuccess("Bỏ số thành công !")
            return data
        }
    })
}

