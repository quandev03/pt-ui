import { Text } from "@react/commons/Template/style";
import { Tooltip } from "antd";
import { TableProps } from "antd/lib"
import { ButtonWrapper } from "../pages/styles";
import dayjs from "dayjs";
import { formatDate } from "@react/constants/moment";
import { IOnlineOrdersCSManagement } from "../types";

interface ICollumProps {
    more: (record: any) => React.ReactNode
}

export const getCollumn: (props: ICollumProps) => TableProps<IOnlineOrdersCSManagement>['columns'] = ({ more }: ICollumProps) => {
    return [
        {
            title: 'STT',
            align: 'center',
            width: 50,
            fixed: 'left',
            render(_, record, index) {
                return (
                    <Text>
                        {index + 1}
                    </Text>
                );
            },
        },
        {
            title: 'Mã vận đơn',
            dataIndex: 'billCode',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderCode',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'isdn',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Serial SIM',
            dataIndex: 'serialSim',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Loại SIM',
            dataIndex: 'SIMType',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Gói cước',
            dataIndex: 'package',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Tên KH',
            dataIndex: 'customerName',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Số liên hệ',
            dataIndex: 'contactNumber',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Phường/Xã',
            dataIndex: 'communes',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Quận/Huyện',
            dataIndex: 'district',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'province',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Thời gian đặt hàng',
            dataIndex: 'orderDate',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value ? dayjs(value).format(formatDate) : ''} placement="topLeft">
                        <Text>{value ? dayjs(value).format(formatDate) : ''}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Tổng tiền sản phẩm',
            dataIndex: 'productPrice',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Phí vận chuyển',
            dataIndex: 'deliveryFee',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Tổng giá trị đơn hàng',
            dataIndex: 'amount',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Trạng thái ĐH',
            dataIndex: 'status',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Trạng thái thanh toán',
            dataIndex: 'paymentStatus',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'User ghép KIT',
            dataIndex: 'userKit',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Thời gian ghép KIT',
            dataIndex: 'KITDate',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value ? dayjs(value).format(formatDate) : ''} placement="topLeft">
                        <Text>{value ? dayjs(value).format(formatDate) : ''}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Kênh bán',
            dataIndex: 'saleChannel',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'PT vận chuyển',
            dataIndex: 'deliveryType',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Đơn vị vận chuyển',
            dataIndex: 'deliveryUnit',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Người hủy đơn',
            dataIndex: 'cancelUser',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Thời gian hủy đơn',
            dataIndex: 'cancelOrderDate',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value ? dayjs(value).format(formatDate) : ''} placement="topLeft">
                        <Text>{value ? dayjs(value).format(formatDate) : ''}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Lý do hủy',
            dataIndex: 'cancelOrderReason',
            width: 250,
            render(value, record) {
                return (
                    <Tooltip title={value} placement="topLeft">
                        <Text>{value}</Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Thao tác',
            width: 200,
            fixed: 'right',
            align: 'center',
            render(value, record) {
                return (
                    <ButtonWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {more(record)}
                    </ButtonWrapper>
                );
            },
        },
    ]
}