import {
  ActionsTypeEnum,
  CButtonDetail,
  CTag,
  formatDate,
  formatDateTime,
  IModeAction,
  IParamsRequest,
  StatusEnum,
  Text,
  TypeTagEnum,
  WrapperActionTable,
} from '@vissoft-react/common';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { MoreVertical } from 'lucide-react';
import { IRoleItem } from '../types';

export const DEFAULT_VALUE_ROLE: IRoleItem = {
  id: '',
  createdBy: '',
  createdDate: '',
  description: '',
  lastModifiedBy: '',
  lastModifiedDate: '',
  name: '',
  status: 1,
  checkedKeys: [],
  code: '',
};

export const getColumnsTableRole = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  {
    onDelete,
    onAction,
  }: {
    onAction: (type: IModeAction, record: IRoleItem) => void;
    onDelete: (record: IRoleItem) => void;
  }
): ColumnsType<IRoleItem> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return (
          <Text disabled={record.status === StatusEnum.INACTIVE}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Mã vai trò',
      dataIndex: 'code',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === StatusEnum.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === StatusEnum.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      align: 'left',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === StatusEnum.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={record.status === StatusEnum.INACTIVE}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'lastModifiedBy',
      align: 'left',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === StatusEnum.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastModifiedDate',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={record.status === StatusEnum.INACTIVE}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'left',
      width: 100,
      render(value) {
        return (
          <Tooltip
            title={
              value === StatusEnum.ACTIVE ? 'Hoạt động' : 'Không hoạt động'
            }
            placement="topLeft"
          >
            <CTag
              type={
                value === StatusEnum.ACTIVE
                  ? TypeTagEnum.SUCCESS
                  : TypeTagEnum.ERROR
              }
            >
              {value === StatusEnum.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: ActionsTypeEnum.UPDATE,
            onClick: () => {
              onAction(IModeAction.UPDATE, record);
            },
            label: <Text>Sửa</Text>,
          },
          {
            key: ActionsTypeEnum.DELETE,
            onClick: () => {
              onDelete(record);
            },
            label: <Text type="danger">Xóa</Text>,
          },
        ].filter((item) => includes(listRoles, item?.key));
        return (
          <WrapperActionTable>
            {includes(listRoles, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() => {
                  onAction(IModeAction.READ, record);
                }}
              />
            )}
            <div className="w-5">
              {(includes(listRoles, ActionsTypeEnum.UPDATE) ||
                includes(listRoles, ActionsTypeEnum.DELETE)) && (
                <Dropdown
                  menu={{ items: items }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <MoreVertical size={16} />
                </Dropdown>
              )}
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};
