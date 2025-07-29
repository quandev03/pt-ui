import { ACTION_MODE_ENUM, IParamsRequest } from '@react/commons/types';
import { IAttachment, IPartnerCreditLimitsList } from '../type';
import { ColumnsType } from 'antd/es/table';
import { ActionsTypeEnum } from '@react/constants/app';
import { Dropdown, Tooltip } from 'antd';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { formatCurrencyVND } from '@react/helpers/utils';
import { FormattedMessage } from 'react-intl';
import { includes } from 'lodash';
import { CButtonDetail } from '@react/commons/Button';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import dayjs from 'dayjs';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { IOption } from 'apps/Internal/src/components/layouts/types';

export const geColumnsTableList = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  PARTNER_TYPE: IOption[] = [],
  onAction: (type: ACTION_MODE_ENUM, record: IPartnerCreditLimitsList) => void
): ColumnsType<IPartnerCreditLimitsList> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên đối tác',
      dataIndex: 'orgName',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại đối tác',
      dataIndex: 'orgSubType',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value) {
        const text =
          PARTNER_TYPE.find((item) => item.value == value)?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Hạn mức',
      dataIndex: 'limitAmount',
      width: 150,
      align: 'right',
      render(value) {
        const text = formatCurrencyVND(value ?? '');
        return (
          <Tooltip title={text} placement="topRight">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Công nợ',
      dataIndex: 'debtTotalAmount',
      width: 150,
      align: 'right',
      render(value) {
        const text = formatCurrencyVND(value ?? '');
        return (
          <Tooltip title={text} placement="topRight">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Hạn mức còn lại',
      width: 150,
      align: 'right',
      render(_, record) {
        const text = record.limitAmount - record.debtTotalAmount;
        return (
          <Tooltip title={formatCurrencyVND(text ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(text ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 250,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 250,
      align: 'left',
      render(value) {
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
      width: 150,
      align: 'left',
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 160,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: 1,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.EDIT, record);
            },
            label: <Text>Điều chỉnh hạn mức</Text>,
          },
          {
            key: 2,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.DebtDetail, record);
            },
            label: <Text>Chi tiết công nợ</Text>,
          },
        ];

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
              {includes(listRoles, ActionsTypeEnum.UPDATE) && (
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

export const geColumnsTableListHistory = (
  params: IParamsRequest,
  onDownload: (item: IAttachment) => void
): ColumnsType<IPartnerCreditLimitsList> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Hạn mức',
      dataIndex: 'limitAmount',
      width: 100,
      align: 'right',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'createdBy',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Ngày cập nhật',
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Danh sách file đính kèm',
      width: 200,
      align: 'left',
      render(_, record) {
        return (
          <div className="flex flex-col gap-2 flex-wrap">
            {record.attachments.map((item) => (
              <Tooltip
                title={item.fileName}
                placement="topLeft"
                key={item.fileName}
              >
                <Text
                  onClick={() => onDownload(item)}
                  className="cursor-pointer w-full"
                >
                  {item.fileName}
                </Text>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 200,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};

export const geColumnsTableListDebtHistory = (
  params: IParamsRequest,
  onDownload: (item: IAttachment) => void
): ColumnsType<IPartnerCreditLimitsList> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'debtAmount',
      width: 100,
      align: 'right',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại thu chi',
      dataIndex: 'debtType',
      width: 100,
      align: 'left',
      fixed: 'left',
      render(value) {
        const text = value == 1 ? 'Thu' : 'Chi';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Hạn mức còn lại',
      dataIndex: 'debtRemain',
      width: 125,
      align: 'right',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'reasonName',
      width: 100,
      align: 'left',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 200,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày điều chỉnh',
      dataIndex: 'adjustmentDate',
      width: 140,
      align: 'left',
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Danh sách file đính kèm',
      width: 200,
      align: 'left',
      render(_, record) {
        return (
          <div className="flex flex-col gap-2 flex-wrap">
            {record.attachments.map((item) => (
              <Tooltip
                title={item.fileName}
                placement="topLeft"
                key={item.fileName}
              >
                <Text onClick={() => onDownload(item)}>
                  <p
                    className="w-max !mb-0"
                    style={{
                      color: 'rgb(59 130 246)',
                      cursor: 'pointer',
                    }}
                  >
                    {item.fileName}
                  </p>
                </Text>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 200,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
