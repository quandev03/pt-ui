import { ExportRequest } from "../../components/layouts/types";

export interface TableFormProps {
    title: string;
    name: string;
    disabled: boolean;
}
export interface IPhoneNumberItem {
    totalPages: number; 
    totalElements: number;
    size: number;
    number: number;
}
export interface IState {
    status: boolean,
    isdn: string,
}

export type FormSearch = {
    startDate: Date
    endDate: Date
}

export type PropsModal = {
    open: boolean;
    onClose: () => void;
    isdn: string;
};

export interface IParameter {
    "value-search"?: string,
    "stock-id"?: number,
    "status"?: number,
    "transfer-status"?: number,
    reload?: boolean,
    page: number,
    size: number,
}
export interface IParameterDate {
    "from-date"?: string,
    "to-date"?: string
}
export interface IStatus {
    "table-name": string,
    "column-name": string
}

export interface IRequest extends ExportRequest {
    params?: any
}