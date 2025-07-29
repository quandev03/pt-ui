import { IParamsRequest } from '@react/commons/types';
import { DateFormat, FILE_TYPE, TenMinutes } from '@react/constants/app';
import { prefixResourceService } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';

export interface IParamsListKit extends IParamsRequest {
    isdn?: string;
    productId?: number;
    fromSerial?: string;
    toSerial?: string;
    packageId?: string;
}

export interface IKitListItem {
    id: number;
    isdn: number;
    serial: number;
    productName: string;
    packageProfileName: string;
    isdnType: string;
    profileType: string;
    simType: string;
    stockIsdnName: string;
    stockSerialName: string;
    processType: number;
    ownerName: any;
    createdBy: string;
    createdDate: string;
    status: number | string;
}

const fetcher = async (params: IParamsListKit): Promise<Blob> => {
    const query = new URLSearchParams();

    if (params.isdn) query.append("isdn", params.isdn);
    if (params.fromSerial) query.append("fromSerial", params.fromSerial);
    if (params.toSerial) query.append("toSerial", params.toSerial);
    if (params.productId) query.append("productId", String(params.productId));
    if (params.packageId) query.append("packageId", params.packageId);

    const url = `${prefixResourceService}/export-kit/export-list-kit?${query.toString()}`;

    const response = await axiosClient.post(url, null, {
        responseType: 'blob',
        timeout: TenMinutes
    });

    return response;
};


export const useExportList = () => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (res: Blob) => {
            downloadFileFn(
                res,
                `danh_sach_kit-${dayjs().format(DateFormat.EXPORT)}`,
                FILE_TYPE.csv
            );
        },
    });
};
