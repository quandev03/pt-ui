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
import { IRoleItem } from '../../RoleManagement/types';
import { IGroups, IUserItem } from '../types';
import { ColorList } from '@react/constants/color';

export const getColumnsTableUser = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  {
    onDelete,
    onAction,
  }: {
    onAction: (type: ACTION_MODE_ENUM, record: IUserItem) => void;
    onDelete: (record: IUserItem) => void;
  }
): ColumnsType<IUserItem> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return (
          <Text disabled={!record?.status}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      width: 100,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      width: 250,
      align: 'left',
      render(value: IRoleItem[], record) {
        const roleNames = value
          ?.filter((item) => item.status !== ModelStatus.INACTIVE)
          ?.map((item) => item.name)
          ?.join(', ');
        return (
          <Tooltip title={roleNames} placement="topLeft">
            <Text disabled={record?.status !== 1}>{roleNames}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nhóm tài khoản',
      dataIndex: 'groups',
      width: 250,
      align: 'left',
      render(value: IGroups[], record) {
        const roleNames = value
          ?.filter((item) => item.status !== ModelStatus.INACTIVE)
          ?.map((item) => item.name)
          ?.join(', ');
        return (
          <Tooltip title={roleNames} placement="topLeft">
            <Text disabled={record?.status !== 1}>{roleNames}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 120,
      align: 'left',
      render(value, record) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <Tooltip title={textformatDateTime} placement="topLeft">
            <Text disabled={record?.status !== 1}>{textformatDate}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'lastModifiedBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record?.status !== 1}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'lastModifiedDate',
      width: 120,
      align: 'left',
      render(value, record) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <Tooltip title={textformatDateTime} placement="topLeft">
            <Text disabled={record?.status !== 1}>{textformatDate}</Text>
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
                id={
                  value === ModelStatus.ACTIVE
                    ? 'common.active'
                    : 'common.inactive'
                }
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
                id={
                  value === ModelStatus.ACTIVE
                    ? 'common.active'
                    : 'common.inactive'
                }
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
                onClick={() => {
                  onAction(ACTION_MODE_ENUM.VIEW, record);
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
