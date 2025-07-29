import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text } from '@react/commons/Template/style';
import { IParamsRequest } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { IOption } from 'apps/Internal/src/components/layouts/types';
import { TransactionSearchImportExportItem } from 'apps/Internal/src/modules/TransactionSearchImportExport/types';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';

export enum MoveMethodEnum {
  EXPORT = '1',
  IMPORT = '2',
  RECOVERY = '3',
  RETURN = '4',
}

export enum StatusEnum {
  IN_STOCK = '1',
  WAITING_STOCK = '2',
  CANCEL = '3',
  EXPORTED = '4',
}
export const StatusColor = {
  [StatusEnum.IN_STOCK]: ColorList.PROCESSING,
  [StatusEnum.WAITING_STOCK]: ColorList.SUCCESS,
  [StatusEnum.CANCEL]: ColorList.FAIL,
  [StatusEnum.EXPORTED]: ColorList.SUCCESS,
};

export enum MoveTypeEnum {
  EXPORT = '1',
  IMPORT = '2',
}

export const getColumnListTransactionSearchImportExport = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  STOCK_MOVE_LOOK_UP_MOVE_TYPE: IOption[],
  STOCK_MOVE_STATUS: IOption[],
  onView: (data: TransactionSearchImportExportItem) => void,
  onCancel: (data: TransactionSearchImportExportItem) => void
): ColumnsType<TransactionSearchImportExportItem> => {
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'stockMoveCode',
      width: 180,
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
      title: 'Loại giao dịch',
      dataIndex: 'lookUpType',
      width: 180,
      align: 'left',
      fixed: 'left',
      render(value) {
        const text =
          STOCK_MOVE_LOOK_UP_MOVE_TYPE.find(
            (item) => String(item.value) === String(value)
          )?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày lập',
      dataIndex: 'moveDate',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 130,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 130,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      align: 'left',
      render: (value, record) => {
        const text =
          STOCK_MOVE_STATUS.find((item) => item.value == value)?.label ?? '';

        if (value == StatusEnum.IN_STOCK) {
          return (
            <Tooltip title={text} placement="topLeft">
              <CTag color={StatusColor[value as StatusEnum]}>{text}</CTag>
            </Tooltip>
          );
        } else if (
          value == StatusEnum.CANCEL &&
          (record.lookUpType == 7 || record.lookUpType == 8)
        ) {
          return (
            <Tooltip title={text} placement="topLeft">
              <CTag color={StatusColor[value as StatusEnum]}>{text}</CTag>
            </Tooltip>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: <FormattedMessage id="common.action" />,
      align: 'left',
      width: 125,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: ActionsTypeEnum.CANCEL,
            onClick: () => {
              onCancel(record);
            },
            label: <Text type="danger">Hủy giao dịch</Text>,
          },
        ];
        return (
          <div className="flex items-center">
            {includes(listRoles, ActionsTypeEnum.READ) && (
              <CButtonDetail onClick={() => onView(record)} />
            )}
            {(record.lookUpType === 8 || record.lookUpType === 7) &&
              record.status !== 3 && (
                <Dropdown
                  menu={{ items: items }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <IconMore className="iconMore cursor-pointer" />
                </Dropdown>
              )}
          </div>
        );
      },
    },
  ];
};
