import {
  RenderCell,
  decodeSearchParams,
  formatDate,
  formatDateTime,
  Text,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { IPackageSaleItem } from '../types';
import { useGetFileDownloadFn } from './useDownloadFile';
import { Tooltip } from 'antd';
import { ProcessingStatusEnum, SalePackageTypeEnum } from '../constants/enum';

export const useGetTableList = (): ColumnsType<IPackageSaleItem> => {
  const { mutate: getFileDownload } = useGetFileDownloadFn();

  const handleDownload = (url: string) => {
    getFileDownload(url);
  };

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
      dataIndex: 'fileName',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        if (record.type === SalePackageTypeEnum.SINGLE_SALE) {
          return <RenderCell value={record.isdn} tooltip={record.isdn} />;
        }
        return (
          <div className="cursor-pointer">
            <Tooltip title={value} placement="topLeft">
              <Text
                className="text-blue-600 underline cursor-pointer"
                onClick={() => handleDownload(record.fileUrl)}
              >
                {value}
              </Text>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'Hình thức bán gói',
      dataIndex: 'type',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value) {
        let displayText = '';
        if (value === SalePackageTypeEnum.SINGLE_SALE) {
          displayText = 'Đơn lẻ';
        }
        if (value === SalePackageTypeEnum.BATCH_SALE) {
          displayText = 'Theo lô';
        }

        return <RenderCell value={displayText} tooltip={displayText} />;
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'pckCode',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 200,
      align: 'left',
      render(value) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: 'createdDate',
      width: 150,
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
      title: 'Thời gian hoàn thành',
      dataIndex: 'createdDate',
      width: 150,
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
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render(value) {
        let displayText = '';
        let textColor = '';

        if (value === ProcessingStatusEnum.COMPLETED) {
          displayText = 'Hoàn thành';
          textColor = '#178801';
        } else {
          displayText = 'Đang xử lý';
          textColor = '#FAAD14';
        }

        return (
          <RenderCell
            value={<span style={{ color: textColor }}>{displayText}</span>}
            tooltip={displayText}
          />
        );
      },
    },
    {
      title: 'Kết quả',
      width: 140,
      align: 'left',
      render(_, record) {
        let renderedValue;
        if (record.type === SalePackageTypeEnum.SINGLE_SALE) {
          renderedValue = (
            <div className="my-2">
              <p>Số lượng thành công: {record.succeededNumber}</p>
              <p>Số lượng thất bại: {record.failedNumber}</p>
            </div>
          );
        }
        if (record.type === SalePackageTypeEnum.BATCH_SALE) {
          renderedValue = (
            <div className="my-2">
              <p>Số lượng thành công: {record.succeededNumber}</p>
              <p>Số lượng thất bại: {record.failedNumber}</p>
              <p>
                File kết quả:
                <span
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => handleDownload(record.resultFileUrl)}
                >
                  File
                </span>
              </p>
            </div>
          );
        }
        return <RenderCell value={renderedValue} />;
      },
    },
  ];
};
