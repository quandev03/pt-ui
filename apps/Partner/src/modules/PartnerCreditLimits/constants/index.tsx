import { Text } from '@react/commons/Template/style';
import { IParamsRequest } from '@react/commons/types';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { formatCurrencyVND } from '@react/helpers/utils';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IAttachment, IPartnerCreditLimitsList } from '../type';
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
      width: 150,
      align: 'right',
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
            {record.attachments &&
              record.attachments.map((item) => (
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
