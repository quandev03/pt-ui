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
import { ICoverageAreaItem } from '../types';
import { ColorList } from '@react/constants/color';

export const getColumnsTableCoverageArea = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  {
    onDelete,
    onAction,
  }: {
    onAction: (type: ACTION_MODE_ENUM, record: ICoverageAreaItem) => void;
    onDelete: (record: ICoverageAreaItem) => void;
  }
): ColumnsType<ICoverageAreaItem> => {
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
      title: 'Tên quốc gia/ khu vực',
      dataIndex: 'name',
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
            <CButtonDetail
              onClick={() => onAction(ACTION_MODE_ENUM.VIEW, record)}
            />

            {items.length > 0 && (
              <Dropdown menu={{ items }} placement="bottomRight">
                <IconMore className="cursor-pointer" />
              </Dropdown>
            )}
          </WrapperActionTable>
        );
      },
    },
  ];
};
export const getColumnsTableNation = (
  params: IParamsRequest
): ColumnsType<ICoverageAreaItem> => {
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
      title: 'Mã quốc gia',
      dataIndex: 'rangeCode',
      width: 100,
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
      title: 'Tên quốc gia',
      dataIndex: 'rangeName',
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
  ];
};
