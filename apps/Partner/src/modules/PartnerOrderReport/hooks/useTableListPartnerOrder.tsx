import { ColumnsType } from 'antd/es/table';
import { IPartnerOrderReport } from '../type';
import {
  decodeSearchParams,
  formatDateTime,
  RenderCell,
} from '@vissoft-react/common';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

export const useTableListPartnerOrder =
  (): ColumnsType<IPartnerOrderReport> => {
    const [searchParams] = useSearchParams();
    const params = decodeSearchParams(searchParams);
    return [
      {
        title: 'STT',
        align: 'left',
        width: 50,
        fixed: 'left',
        render(_, record, index) {
          return (
            <RenderCell
              value={index + 1 + params.page * params.size}
              tooltip={index + 1 + params.page * params.size}
            />
          );
        },
      },
      {
        title: 'Mã đơn hàng',
        dataIndex: 'orderNo',
        width: 150,
        align: 'left',
        fixed: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Mã phòng',
        dataIndex: 'orgCode',
        width: 150,
        align: 'left',
        fixed: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Tên phòng',
        dataIndex: 'orgName',
        width: 150,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Tổng tiền gói cước',
        dataIndex: 'amountTotal',
        width: 150,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Số lượng eSIM',
        dataIndex: 'quantity',
        width: 150,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'eSIM book thành công',
        dataIndex: 'succeededNumber',
        width: 150,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Người tạo',
        dataIndex: 'createdBy',
        width: 150,
        align: 'left',
        render(value, record) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Ngày đặt hàng',
        dataIndex: 'orderDate',
        width: 150,
        align: 'left',
        render(value) {
          const textFormatDate = value
            ? dayjs(value).format(formatDateTime)
            : '';
          return <RenderCell value={textFormatDate} tooltip={textFormatDate} />;
        },
      },
    ];
  };
