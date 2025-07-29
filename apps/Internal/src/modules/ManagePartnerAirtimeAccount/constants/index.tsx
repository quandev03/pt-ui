import { Text } from '@react/commons/Template/style';
import { AnyElement, IParamsRequest } from '@react/commons/types';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getListOrgSubType } from '../type';
import { formatCurrencyVND } from '@react/helpers/utils';

export const getColumnsManagerPartnerAirtimeAccount = (
  params: IParamsRequest
): ColumnsType<AnyElement> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(value, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên đối tác',
      align: 'left',
      width: 130,
      dataIndex: 'orgName',
      render(value: string) {
        return (
          <Tooltip placement="topLeft" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại đối tác',
      align: 'left',
      width: 130,
      dataIndex: 'orgSubType',
      render(value: string) {
        const text = getListOrgSubType().find(
          (item) => item.value === value
        )?.label;
        return (
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số dư hiện tại',
      align: 'right',
      width: 100,
      dataIndex: 'amount',
      render(value: string) {
        const text = formatCurrencyVND(Number(value));
        return (
          <Tooltip placement="topRight" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian tạo',
      align: 'center',
      width: 130,
      dataIndex: 'createdDate',
      render(value: string) {
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip
            placement="top"
            title={value ? dayjs(value).format(formatDateTime) : ''}
          >
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian cập nhật gần nhất',
      align: 'left',
      width: 130,
      dataIndex: 'modifiedDate',
      render(value: string) {
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip
            placement="topLeft"
            title={value ? dayjs(value).format(formatDateTime) : ''}
          >
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
