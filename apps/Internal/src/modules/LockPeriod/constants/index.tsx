import { Text } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';

import Show from '@react/commons/Template/Show';
import { IParamsRequest } from '@react/commons/types';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Button, Form, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getLabelStatus, STATUS_LOCKPERIOD } from '../type';
import { ILockPeriod } from '../type';
export const getColumnsTableLockPeriod = (
  params: IParamsRequest,
  edit: (record: ILockPeriod) => void
): ColumnsType<AnyElement> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 26,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Chu kỳ',
      dataIndex: 'endDate',
      align: 'left',
      width: 100,
      render(value: string) {
        const text = dayjs(value).format('MM/YYYY');
        return (
          <Tooltip placement="topLeft" title={text}>
            <Form.Item>
              <Text>{text}</Text>
            </Form.Item>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'lockBy',
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
      title: 'Ngày thực hiện',
      dataIndex: 'dateLock',
      align: 'left',
      width: 100,
      render(value: string) {
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip
            placement="topLeft"
            title={value ? dayjs(value).format(formatDate) : ''}
          >
            <Form.Item>
              <Text>{text}</Text>
            </Form.Item>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusLock',
      align: 'left',
      width: 100,
      render(value: number) {
        return (
          <Tooltip placement="topLeft" title={getLabelStatus(value)}>
            <Form.Item>
              <Text>{getLabelStatus(value)}</Text>
            </Form.Item>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <>
            <Show.When isTrue={record.statusLock === STATUS_LOCKPERIOD.OPEN}>
              <Button onClick={() => edit(record)}>Khóa kỳ</Button>
            </Show.When>
            <Show.When isTrue={record.statusLock === STATUS_LOCKPERIOD.CLOSE}>
              <Button onClick={() => edit(record)}>Mở khóa kỳ</Button>
            </Show.When>
          </>
        );
      },
    },
  ];
};
