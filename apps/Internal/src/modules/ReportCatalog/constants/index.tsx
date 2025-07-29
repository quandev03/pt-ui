import { Text } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { formatCurrencyVND } from '@react/helpers/utils';
import { Form, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { InputDescription } from '../components/InputDescription';
import {
  IReportOnPackagePurchaseItem,
  mappingColor,
  mappingColorRegPckStatus,
} from '../type';
import CTag from '@react/commons/Tag';
export const columnsReportInventory = ({
  params,
}: {
  params: AnyElement;
}): ColumnsType<AnyElement> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      render(value: string, record: AnyElement, index: number) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      align: 'left',
      width: 140,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUOM',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tồn đầu kỳ',
      dataIndex: 'beginningInventory',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nhập trong kỳ',
      dataIndex: 'inputInventory',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Xuất trong kỳ',
      dataIndex: 'outputInventory',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tồn cuối kỳ',
      dataIndex: 'endingInventory',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};

export const getColumnsTableReportOnPackagePurchase = (params: {
  page: number;
  size: number;
}): ColumnsType<IReportOnPackagePurchaseItem> => {
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
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      fixed: 'left',
      width: 200,
      render(value) {
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
      width: 100,
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên gói cước',
      dataIndex: 'pckName',
      width: 130,
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã gói cước',
      dataIndex: 'pckCode',
      width: 100,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      width: 130,
      align: 'right',
      render: (value) => (
        <Tooltip
          title={value ? formatCurrencyVND(Number(value)) : ''}
          placement="topRight"
        >
          <Text>{value ? formatCurrencyVND(Number(value)) : ''}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'registeredPckTime',
      width: 150,
      render(value) {
        const text = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'payStatus',
      width: 170,
      render(value) {
        const text = mappingColor[value as keyof typeof mappingColor];
        return (
          <Tooltip title={value} placement="topLeft">
            <CTag color={text}>{value}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái gán',
      dataIndex: 'regPckStatus',
      width: 170,
      render(value) {
        const text =
          mappingColorRegPckStatus[
          value as keyof typeof mappingColorRegPckStatus
          ];
        return (
          <Tooltip title={value} placement="topLeft">
            <CTag color={text}>{value}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tháng',
      dataIndex: 'createdDate',
      width: 100,
      render(value) {
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'channelName',
      width: 130,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 250,
      render: (_: string, record: AnyElement) => (
        <Form.Item
          rules={[{ required: true }]}
          name={['description', record.orderId]}
        >
          <InputDescription record={record} />
        </Form.Item>
      ),
    },
  ];
};

// báo cáo nạp tiền

export const getColumnsTableRechargeReport = (params: {
  page: number;
  size: number;
}): ColumnsType<IReportOnPackagePurchaseItem> => {
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
      title: 'Mã đơn hàng VNSKY',
      dataIndex: 'refOrderNo',
      fixed: 'left',
      width: 200,
      render(value) {
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
      width: 100,
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Mệnh giá nạp',
      dataIndex: 'amount',
      width: 130,
      align: 'right',
      render: (value) => (
        <Tooltip
          title={value ? formatCurrencyVND(Number(value)) : ''}
          placement="topRight"
        >
          <Text>{value ? formatCurrencyVND(Number(value)) : ''}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'transTime',
      width: 150,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tháng',
      dataIndex: 'transDate',
      width: 100,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kênh nạp tiền',
      dataIndex: 'topupChannel',
      width: 100,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
