import {
  ActionsTypeEnum,
  CButtonDetail,
  CTag,
  CTooltip,
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
import { IUserGroup } from '../types';

export const getColumnUserGroup = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  {
    onDelete,
    onAction,
  }: {
    onAction: (type: IModeAction, record: IUserGroup) => void;
    onDelete: (record: IUserGroup) => void;
  }
): ColumnsType<IUserGroup> => {
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return (
          <Text disabled={record?.status !== StatusEnum.ACTIVE}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Mã nhóm tài khoản',
      dataIndex: 'code',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== StatusEnum.ACTIVE}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== StatusEnum.ACTIVE}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      width: 150,
      align: 'left',
      render: (value, record) => {
        const text = record.roles.map((item) => item.name).join(', ');
        return (
          <Tooltip title={text} placement="topLeft">
            <Text disabled={record?.status !== StatusEnum.ACTIVE}>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'lastModifiedBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== StatusEnum.ACTIVE}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastModifiedDate',
      width: 130,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={record?.status !== StatusEnum.ACTIVE}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render: (value) => {
        return (
          <CTooltip
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
          </CTooltip>
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
            label: (
              <Text>
                <Text>Sửa</Text>
              </Text>
            ),
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
                onClick={() => onAction(IModeAction.READ, record)}
              />
            )}
            <div className="w-5">
              {(includes(listRoles, ActionsTypeEnum.UPDATE) ||
                includes(listRoles, ActionsTypeEnum.DELETE)) && (
                <Dropdown
                  menu={{ items }}
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
