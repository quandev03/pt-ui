import {
  CTag,
  CTooltip,
  RenderCell,
  StatusEnum,
  TypeTagEnum,
  decodeSearchParams,
  formatDate,
  formatDateTime,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { IPackageSaleItem } from '../types';

export const useGetTableList = (): ColumnsType<IPackageSaleItem> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
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
      title: 'Tên file/Số thuê bao',
      dataIndex: 'fileNameOrSubscriberNumber',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Hình thức bán gói',
      dataIndex: 'saleMethod',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'packageName',
      width: 250,
      align: 'left',
      fixed: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'performedBy',
      width: 200,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'executionDate',
      width: 120,
      align: 'left',
      render(value) {
        const textformatDate = value ? dayjs(value).format(formatDate) : '';
        const textformatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <RenderCell value={textformatDate} tooltip={textformatDateTime} />
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
          <CTooltip title={value} placement="topLeft">
            <CTag
              type={
                value === StatusEnum.ACTIVE
                  ? TypeTagEnum.SUCCESS
                  : TypeTagEnum.ERROR
              }
            >
              {value}
            </CTag>
          </CTooltip>
        );
      },
    },
    {
      title: 'Kết quả',
      width: 120,
      align: 'left',
      render(_, record) {
        const renderedValue = (
          <>
            <p>Số lượng thành công: {record.successNumber}</p>
            <p>Số lượng thất bại: {record.failedNumber}</p>
            <p>
              File kết quả: <span className="text-sky-600">File</span>
            </p>
          </>
        );
        return <RenderCell value={renderedValue} />;
      },
    },
  ];
};
