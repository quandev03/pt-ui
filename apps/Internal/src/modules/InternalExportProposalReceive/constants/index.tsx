import { CButtonDetail } from "@react/commons/Button";
import CTag from "@react/commons/Tag";
import { Text, WrapperActionTable } from "@react/commons/Template/style";
import { AnyElement, IParamsRequest } from "@react/commons/types";
import { ActionsTypeEnum } from "@react/constants/app";
import { formatDate, formatDateTime } from "@react/constants/moment";
import { Dropdown, Form, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import dayjs from "dayjs";
import { getLabelTypeProposal } from "../../InternalExportProposalSend/type";
import { getColorStatusApproval, getColorStatusOrder, getLabelStatus } from "../type";
export const getColumnsTableInternalExportProposal = (
    params: IParamsRequest,
    {
        onDetail,
        onProcessApproval
    }: {
        onDetail: (record: AnyElement) => void,
        onProcessApproval: (record: AnyElement) => void,
    }
): ColumnsType<AnyElement> => {
    const renderMenuItemsMore = (
        record: AnyElement
    ): AnyElement => {
        const arr = [
            {
                key: ActionsTypeEnum.UPDATE,
                label: (
                    <Text onClick={() => onProcessApproval(record)}>
                        Tiến độ phê duyệt
                    </Text>
                ),
            }
        ];
        return arr
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
            dataIndex: 'orderType',
            align: 'left',
            width: 100,
            render(value: number) {
                const text = getLabelTypeProposal(value)
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <Text>{text}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Ngày lập',
            dataIndex: 'orderDate',
            align: 'left',
            width: 100,
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
            width: 90,
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
            title: 'Trạng thái phê duyệt',
            dataIndex: 'approvalStatus',
            align: 'left',
            width: 160,
            render(value: number) {
                const labelStatus = getLabelStatus();
                return (
                  <Tooltip placement="topLeft" title={labelStatus.getLabelStatusApproval(value)}>
                        <CTag color={getColorStatusApproval(value)}>
                            {labelStatus.getLabelStatusApproval(value)}
                        </CTag>
                  </Tooltip>
                );
            },
        },
        {
            title: 'Trạng thái đề nghị',
            dataIndex: 'orderStatus',
            align: 'left',
            width: 140,
            render(value: number) {
                const labelStatus = getLabelStatus();
                return (
                   <Tooltip placement="topLeft" title={labelStatus.getLabelStatusOrder(value)}>
                        <CTag color={getColorStatusOrder(value)}>
                            {labelStatus.getLabelStatusOrder(value)}
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