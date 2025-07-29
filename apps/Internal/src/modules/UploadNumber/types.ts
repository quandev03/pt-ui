import { IParamsRequest } from '@react/commons/types';
import { ColorList } from '@react/constants/color';

export interface IParamsRequestUploadDigitalResources extends IParamsRequest {
    from: string;
    to: string;
}

export enum NumberUploadStatus {
    PROCESSING = 1,
    FAILURE = 2,
    SUCCESS = 3,
}

export const mappingColorUploadStatus: {
    [key: number]: (typeof ColorList)[keyof typeof ColorList];
} = {
    [NumberUploadStatus.PROCESSING]: ColorList.WAITING,
    [NumberUploadStatus.SUCCESS]: ColorList.SUCCESS,
    [NumberUploadStatus.FAILURE]: ColorList.FAIL,
};
