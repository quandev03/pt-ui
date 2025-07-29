import { CButtonDetail } from "@react/commons/Button";
import { Text, WrapperActionTable } from "@react/commons/Template/style";
import { AnyElement, IParamsRequest } from "@react/commons/types";
import { formatDate, formatDateTime } from "@react/constants/moment";
import { Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getLabelDeliveryNoteMethod } from "../type";
export const getColumnsTableInternalImportExportWarehouse = (
    params: IParamsRequest,
    {
        onDetail,
    }: {
        onDetail: (record: AnyElement) => void,
    }
): ColumnsType<AnyElement> => {
    return [
        {
            title: 'STT',
            align: 'left',
            fixed: 'left',
            width: 50,
            render(_, record, index) {
                return (
                    <Text>
                        {index + 1 + params.page * params.size}
                    </Text>
                );
            },
        },
        {
            title: 'Mã phiếu',
            dataIndex: 'deliveryNoteCode',
            align: 'left',
            width: 140,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'stockMoveCode',
            align: 'left',
            width: 200,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Kho xuất',
            dataIndex: 'orgName',
            align: 'left',
            width: 100,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Kho nhận',
            dataIndex: 'ieOrgName',
            align: 'left',
            width: 100,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Loại GD',
            dataIndex: 'moveMethod',
            align: 'left',
            width: 100,
            render(value: number) {
                return (
                    <Tooltip placement="topLeft" title={getLabelDeliveryNoteMethod(Number(value))}>
                        <Text>{getLabelDeliveryNoteMethod(Number(value))}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Ngày lập',
            dataIndex: 'moveDate',
            align: 'left',
            width: 120,
            render(value: string) {
                const text = value ? dayjs(value).format(formatDate) : '';
                return (
                    <Tooltip placement="topLeft" title={dayjs(value).format(formatDate)}>
                        <Text>{text}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            align: 'left',
            width: 100,
            render(value: string) {
                const text = value ? dayjs(value).format(formatDate) : '';
                return (
                    <Tooltip placement="topLeft" title={dayjs(value).format(formatDateTime)}>
                        <Text>{text}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            align: 'left',
            width: 140,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'modifiedDate',
            align: 'left',
            width: 140,
            render(value: string) {
                const text = value ? dayjs(value).format(formatDate) : '';
                return (
                    <Tooltip placement="topLeft" title={dayjs(value).format(formatDateTime)}>
                        <Text>{text}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Người cập nhật',
            dataIndex: 'modifiedBy',
            align: 'left',
            width: 140,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {

            title: "Thao tác",
            align: 'center',
            width: 150,
            fixed: 'right',
            render(_, record) {
                return (
                    <WrapperActionTable>
                        <CButtonDetail
                            onClick={() => onDetail(record)}
                        />
                    </WrapperActionTable>
                );
            },
        },
    ];
}
