import {
  ActionsTypeEnum,
  CButtonDetail,
  ColorList,
  CTag,
  formatDate,
  formatDateTime,
  IModeAction,
  IOption,
  IParamsRequest,
  Text,
  TypeTagEnum,
  WrapperActionTable,
} from '@vissoft-react/common';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { MoreVertical } from 'lucide-react';
import { IOrganizationUnitDTO } from '../types';

export enum StatusEnum {
  ACTIVE = '1',
  INACTIVE = '0',
}

export enum ApprovedStatusEnum {
  PENDING = '1',
  APPROVING = '2',
  APPROVED = '3',
  CANCEL = '4',
  REJECT = '5',
}

export const COLOR_APPROVED_STATUS = {
  [ApprovedStatusEnum.PENDING]: ColorList.WAITING,
  [ApprovedStatusEnum.APPROVING]: ColorList.PROCESSING,
  [ApprovedStatusEnum.APPROVED]: ColorList.SUCCESS,
  [ApprovedStatusEnum.CANCEL]: ColorList.FAIL,
  [ApprovedStatusEnum.REJECT]: ColorList.FAIL,
};

export const getColumnsStockPermission = (): ColumnsType<any> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Mã kho',
      dataIndex: 'stockCode',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên kho',
      dataIndex: 'stockName',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
