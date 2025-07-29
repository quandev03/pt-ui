import { AnyElement } from "@react/commons/types";
import { prefixCustomerServicePublic } from "@react/url/app";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "apps/Sign/src/service"
interface IRes {
    idNo: string;
    sessionId: string
}
const fetch = async (idContact: string) => {
    const res = await axiosClient.get<AnyElement, IRes>(`${prefixCustomerServicePublic}/check-sky-sale-contract-thread/${idContact}`);
    return res
}
export const useCheckSkySaleContact = (idContact: string) => {
    return useQuery({
        queryFn: () => fetch(idContact),
        queryKey: ['checkSkySaleContact', idContact],
        enabled: !!idContact
    });
};
