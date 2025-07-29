import { CButtonDetail } from "@react/commons/Button";
import CTag from "@react/commons/Tag";
import { Text, WrapperActionTable } from "@react/commons/Template/style";
import { AnyElement, IParamsRequest } from "@react/commons/types";
import { ActionsTypeEnum } from "@react/constants/app";
import { formatDate, formatDateTime } from "@react/constants/moment";
import { DeliveryOrderStatusList } from "@react/constants/status";
import { Dropdown, Form, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import dayjs from "dayjs";
import { getColorStatusApproval, getLabelDeliveryNoteMethod, getLabelStatusApproval } from "../type";
export const getColumnsTableInternalWarehouseDeliveryNote = (
    params: IParamsRequest,
    {
        onCancel,
        onDetail,
    }: {
        onCancel: (record: AnyElement) => void,
        onDetail: (record: AnyElement) => void,
    }
): ColumnsType<AnyElement> => {
    const renderMenuItemsMore = (
        record: AnyElement
    ): AnyElement => {
        const arr = [];
        if (record.status === DeliveryOrderStatusList.CREATE) {
            arr.push(
                {
                    key: ActionsTypeEnum.DELETE,
                    label: (
                        <Text onClick={() => onCancel(record)} type="danger">
                           {record.deliveryNoteMethod === 1 ? "Huỷ phiếu xuất" : "Huỷ phiếu nhập"}
                        </Text>
                    ),
                });
        }
        return arr;
    };
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
            title: 'Mã đề nghị',
            dataIndex: 'orderNo',
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
            title: 'Kho nhập',
            dataIndex: 'toOrgName',
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
            title: 'Loại phiếu',
            dataIndex: 'deliveryNoteMethod',
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
            dataIndex: 'deliveryNoteDate',
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
            title: 'Ngày cập nhật',
            dataIndex: 'modifiedDate',
            align: 'left',
            width: 120,
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
            title: 'Trạng thái phiếu',
            dataIndex: 'status',
            align: 'left',
            width: 130,
            render(value: number) {
                return (
                    <Tooltip placement="topLeft" title={getLabelStatusApproval(value)}>
                        <CTag color={getColorStatusApproval(value)}>
                            {getLabelStatusApproval(value)}
                        </CTag>
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
                        <Dropdown
                            menu={{ items: renderMenuItemsMore(record) }}
                            placement="bottom"
                            trigger={['click']}
                        >
                            <IconMore className="iconMore" />
                        </Dropdown>
                    </WrapperActionTable>
                );
            },
        },
    ];
}



export const getColumnsListTableProduct = (
    params: IParamsRequest
): ColumnsType<AnyElement> => {
    return [
        {
            title: 'STT',
            align: 'left',
            width: 50,
            fixed: 'left',
            render(_, record, index) {
                return <Text>{index + 1 + params.page * params.size}</Text>;
            },
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'orderNo',
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
            title: 'Đơn vị tính',
            dataIndex: 'fromOrgName',
            align: 'left',
            width: 100,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        }
    ];
}


export const getColumnsTableSelectedUser = (
    params: IParamsRequest
): ColumnsType<AnyElement> => {
    return [
        {
            title: 'STT',
            align: 'left',
            width: 50,
            fixed: 'left',
            render(_, record, index) {
                return <Text>{index + 1 + params.page * params.size}</Text>;
            },
        },
        {
            title: 'Username',
            dataIndex: 'username',
            align: 'left',
            width: 100,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Form.Item>
                            <Text>{value}</Text>
                        </Form.Item>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Tên user',
            dataIndex: 'fullName',
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
            title: 'Đơn vị',
            dataIndex: 'orgName',
            align: 'left',
            width: 120,
            render(value: string) {
                return (
                    <Tooltip placement="topLeft" title={value}>
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
    ];
};
