import {
  RenderCell,
  decodeSearchParams,
  formatCurrencyVND,
  formatDate,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { IReportPartnerItem } from '../types';

export const useGetTableList = (): ColumnsType<IReportPartnerItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
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
      width: 180,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Mã đối tác',
      dataIndex: 'orgCode',
      width: 150,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Tên đối tác',
      dataIndex: 'orgName',
      width: 230,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Tổng tiền gói cước gán thành công',
      dataIndex: 'amountTotal',
      width: 260,
      align: 'left',
      render(value) {
        const renderedValue = formatCurrencyVND(value ?? '');
        return <RenderCell value={renderedValue} />;
      },
    },
    {
      title: 'Số lượng eSIM',
      dataIndex: 'quantity',
      width: 120,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'eSIM đặt thành công',
      dataIndex: 'succeededNumber',
      width: 160,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },
    {
      title: 'Người đặt hàng',
      dataIndex: 'createdBy',
      width: 250,
      align: 'left',
      render(value) {
        return <RenderCell value={value} />;
      },
    },

    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      width: 120,
      align: 'left',
      render(value) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';

        return <RenderCell value={textformatDate} />;
      },
    },
  ];
};
