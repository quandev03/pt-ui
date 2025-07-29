import { ACTION_MODE_ENUM, IParamsRequest } from "@react/commons/types";
import { IStockOutForDistributorck, mappingColorStatus, renderDeliveryNoteMethod, renderStatus, StatusStockOutForDistributor } from "../type";
import { ColumnsType } from "antd/es/table";
import { FormattedMessage } from "react-intl";
import { Text, WrapperActionTable } from "@react/commons/Template/style";
import { Dropdown, Tooltip } from "antd";
import CTag from "@react/commons/Tag";
import dayjs from "dayjs";
import { formatDate, formatDateTime } from "@react/constants/moment";
import { ActionsTypeEnum } from "@react/constants/app";
import { CButtonDetail } from "@react/commons/Button";
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';

export const getColumnsTableStockOutForDistributor = (
    params: IParamsRequest,
    onCancel: (id: string) => void,
    onAction: (type: ACTION_MODE_ENUM, record: any) => void,
): ColumnsType<IStockOutForDistributorck> => {
    return [
        {
            title: <FormattedMessage id="common.stt" />,
            align: 'left',
            width: 50,
            fixed: 'left',
            render(_, record, index) {
                return (
                    <Text>
                        {index + 1 + params.page * params.size}
                    </Text>
                );
            },
        },
        {
            title: "Mã phiếu",
            dataIndex: 'deliveryNoteCode',
            align: 'left',
            width: 180,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text >
                            {value}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: <FormattedMessage id="Mã đơn hàng" />,
            dataIndex: 'orderNo',
            align: 'left',
            width: 180,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text >
                            {value}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Đối tác",
            dataIndex: 'toOrgName',
            align: 'left',
            width: 150,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text >
                            {value}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Loại phiếu",
            dataIndex: 'deliveryNoteMethod',
            align: 'left',
            width: 100,
            render(value, record) {
                const text = renderDeliveryNoteMethod(value)
                return (
                    <Tooltip
                        title={text}
                        placement="topLeft"
                    >
                        <Text >
                            {text}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Ngày lập",
            dataIndex: 'deliveryNoteDate',
            align: 'left',
            width: 150,
            render(value, record) {
                const text = dayjs(value).format(formatDate);
                return (
                    <Tooltip title={dayjs(value).format(formatDate)} placement="topLeft">
                        <Text >
                            {text}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Người tạo",
            dataIndex: 'createdBy',
            align: 'left',
            width: 150,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text >
                            {value}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: 'createdDate',
            align: 'left',
            width: 150,
            render(value, record) {
                const text = dayjs(value).format(formatDate);
                return (
                    <Tooltip title={dayjs(value).format(formatDateTime)} placement="topLeft">
                        <Text >
                            {text}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Người cập nhật",
            dataIndex: 'modifiedBy',
            align: 'left',
            width: 150,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text >
                            {value}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Ngày cập nhật",
            dataIndex: 'modifiedDate',
            align: 'left',
            width: 150,
            render(value, record) {
                const text = dayjs(value).format(formatDate);
                return (
                    <Tooltip
                        title={dayjs(value).format(formatDateTime)}
                        placement="topLeft"
                    >
                        <Text >
                            {text}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "Trạng thái phiếu",
            dataIndex: 'status',
            align: 'left',
            width: 140,
            render(value) {
                const text = renderStatus(value)
                return (
                    <Tooltip
                        title={text}
                        placement="topLeft"
                    >
                        <CTag color={mappingColorStatus[value as keyof typeof mappingColorStatus]}>
                            {text}
                        </CTag>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Thao tác',
            align: 'center',
            width: 150,
            fixed: 'right',
            render(_, record) {
                const items = [
                    ...(record.status !== StatusStockOutForDistributor.CANCEL && record.status !== StatusStockOutForDistributor.EXPORT ? [
                        {
                            key: ActionsTypeEnum.DELETE,
                            label: (
                                <Text
                                    type="danger"
                                    onClick={() => {
                                        onCancel(record.id);
                                    }}
                                >
                                    <FormattedMessage id={'Hủy phiếu xuất'} />
                                </Text>
                            ),
                        },
                    ] : []),
                ];
                return (
                    <WrapperActionTable>
                        <CButtonDetail onClick={() => onAction(ACTION_MODE_ENUM.VIEW, record)} />
                        <Dropdown
                            menu={{ items: items }}
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
};
