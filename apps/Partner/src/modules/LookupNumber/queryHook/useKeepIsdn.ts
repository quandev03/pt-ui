import { useMutation } from "@tanstack/react-query";
import { getKeepIsdn } from "../services";
import { QUERY_KEY } from "../constant";
import { NotificationSuccess } from '@react/commons/index';

export const useKeepIsdn = () => {
    return useMutation({
        mutationFn: getKeepIsdn,
        mutationKey: [QUERY_KEY.GET_KEEP_ISDN],
        onSuccess: (data) => {
            console.log(11111111111, data);
            NotificationSuccess("Giữ số thành công !")
        }
    })
}