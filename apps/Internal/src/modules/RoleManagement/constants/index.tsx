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
import { IRoleItem } from '../types';
import CTag from '@react/commons/Tag';
import { CButtonDetail } from '@react/commons/Button';
import { ColorList } from '@react/constants/color';

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
    onAction: (type: ACTION_MODE_ENUM, record: IRoleItem) => void;
    onDelete: (record: IRoleItem) => void;
  }
): ColumnsType<IRoleItem> => {
  return [
    {
      title: <FormattedMessage id="common.stt" />,
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return (
          <Text disabled={record.status === ModelStatus.INACTIVE}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: <FormattedMessage id="role.code" />,
      dataIndex: 'code',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === ModelStatus.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="role.codeName" />,
      dataIndex: 'name',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === ModelStatus.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.creator" />,
      dataIndex: 'createdBy',
      align: 'left',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === ModelStatus.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.creationDate" />,
      dataIndex: 'createdDate',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={record.status === ModelStatus.INACTIVE}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.updater" />,
      dataIndex: 'lastModifiedBy',
      align: 'left',
      width: 200,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={record.status === ModelStatus.INACTIVE}>
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.updatedDate" />,
      dataIndex: 'lastModifiedDate',
      align: 'left',
      width: 100,
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={record.status === ModelStatus.INACTIVE}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.status" />,
      dataIndex: 'status',
      align: 'left',
      width: 100,
      render(value) {
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
