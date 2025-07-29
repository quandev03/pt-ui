import { CTable, CTag } from '@react/commons/index';
import { Text } from '@react/commons/Template/style';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import dayjs from 'dayjs';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetImpactReport } from '../hooks/useGetImpactReport';
import {
  IActionItem,
  ISubscriberImpactReportItem,
  StatusColor,
  StatusEnum,
} from '../types';

type Props = {
  actionTypes: IActionItem[];
};
const Body: React.FC<Props> = ({ actionTypes }) => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: dataTable, isLoading } = useGetImpactReport(
    queryParams(params)
  );
  const { mutate: downloadFile } = useExportMutation();
  const handleDownload = (filePath: string) => {
    downloadFile({
      uri: `${prefixCustomerService}/file/${filePath}`,
      filename: 'Ket_qua_thuc_hien.xlsx',
    });
  };
  const columns: ColumnsType<ISubscriberImpactReportItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Loại tác động',
      dataIndex: 'actionCode',
      width: 120,
      align: 'left',
      render(value) {
        const renderedValue =
          (actionTypes &&
            actionTypes.find((action) => action.code === value)?.name) ||
          '';
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text>{renderedValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Hình thức thực hiện',
      dataIndex: '',
      width: 130,
      align: 'left',
      render(_, record) {
        const renderedValue = record.fileName ? 'Theo file' : 'Theo danh sách';
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text>{renderedValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      width: 150,
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
      title: 'Tên doanh nghiệp',
      dataIndex: 'enterprise',
      width: 120,
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
      title: 'Số hợp đồng ĐK TTTB',
      dataIndex: 'contractNumber',
      width: 120,
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
      title: 'Người thực hiện',
      dataIndex: 'empName',
      width: 120,
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
      title: 'Ngày thực hiện',
      dataIndex: 'createdDate',
      width: 120,
      align: 'left',
      render(value) {
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
      title: 'Trạng thái thực hiện ',
      dataIndex: 'status',
      width: 130,
      align: 'left',
      render(value) {
        const status =
          value === StatusEnum.PROCESSING
            ? 'Đang xử lý'
            : value === StatusEnum.SUCCESS
            ? 'Hoàn thành'
            : '';
        return (
          <Tooltip title={status} placement="topLeft">
            <CTag color={StatusColor[value as keyof typeof StatusColor]}>
              {status}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kết quả',
      width: 150,
      align: 'left',
      render(_, record) {
        const renderedValue = `Số lượng thành công: ${
          record.successCount
        }\nSố lượng thất bại: ${record.failedCount}\nFile kết quả: ${
          record.status === StatusEnum.SUCCESS ? 'File' : ''
        }`;
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text>{`Số lượng thành công: ${record.successCount}`}</Text>
            <Text>{`Số lượng thất bại: ${record.failedCount}`}</Text>
            <Text>
              File kết quả:{' '}
              {record.status === StatusEnum.SUCCESS && (
                <Typography.Link
                  onClick={() => handleDownload(record.resultFilePath || '')}
                >
                  File
                </Typography.Link>
              )}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 120,
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
  return (
    <CTable
      columns={columns}
      dataSource={dataTable?.content || []}
      loading={isLoading}
      pagination={{
        current: params.page + 1,
        pageSize: params.size,
        total: dataTable?.totalElements || 0,
      }}
    />
  );
};
export default Body;
