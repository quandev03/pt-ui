import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import {
  ACTION_MODE_ENUM,
  IParamsRequest,
  ModelStatus,
} from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { IUserGroup } from '../types';
import { ColorList } from '@react/constants/color';

export const getColumnUserGroup = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  {
    onDelete,
    onAction,
  }: {
    onAction: (type: ACTION_MODE_ENUM, record: IUserGroup) => void;
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
          <Text disabled={!record?.status}>
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
            <Text disabled={!record?.status}>{value}</Text>
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
            <Text disabled={!record?.status}>{value}</Text>
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
            <Text disabled={!record?.status}>{text}</Text>
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
            <Text disabled={!record?.status}>{value}</Text>
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
            <Text disabled={!record?.status}>
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
          <Tooltip
            title={
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            }
            placement="topLeft"
          >
            <CTag
              color={
                value === ModelStatus.ACTIVE
                  ? ColorList.SUCCESS
                  : ColorList.CANCEL
              }
            >
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: ActionsTypeEnum.UPDATE,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.EDIT, record);
            },
            label: (
              <Text>
                <FormattedMessage id={'common.edit'} />
              </Text>
            ),
          },
          {
            key: ActionsTypeEnum.DELETE,
            onClick: () => {
              onDelete(record);
            },
            label: (
              <Text type="danger">
                <FormattedMessage id={'common.delete'} />
              </Text>
            ),
          },
        ].filter((item) => includes(listRoles, item?.key));
        return (
          <WrapperActionTable>
            {includes(listRoles, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() => onAction(ACTION_MODE_ENUM.VIEW, record)}
              />
            )}
             <div className="w-5">
              {(includes(listRoles, ActionsTypeEnum.UPDATE) ||
                includes(listRoles, ActionsTypeEnum.DELETE)) && (
                <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
                  <IconMore className="iconMore" />
                </Dropdown>
              )}
             </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};
