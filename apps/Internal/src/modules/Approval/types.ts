import { ACTION_MODE_ENUM } from '@react/commons/types';
export interface AddEditViewProps {
    actionMode: ACTION_MODE_ENUM;
}

export interface ProcessUnitType {
    id: number;
    status: number;
    approvedDate: string;
    approvedUserName: string;
    stepOrder: number;
    mandatorUserId: string;
    mandatorUserName: string;
}

export interface ApprovalType {
    id: number;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    processName: string;
    time_request: string;
    currentStatus: number;
    lastStatus: number;
    processSteps: ProcessUnitType[];
    objectName: string;
    recordId: number;
    processCode: string;
}

export enum ApprovalStatus {
    REFUSE = 0,
    APPROVAl = 1,
}
