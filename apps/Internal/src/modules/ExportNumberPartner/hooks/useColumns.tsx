import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ColorList } from '@react/constants/color';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import { Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { mappingColorTransStatus } from 'apps/Internal/src/constants/constants';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IColumnExportNumberPartner } from '../types';
import { NumberStatus } from '@react/constants/status';

export enum CheckingStatus {
  PROCESSING = 1,
  FAILURE = 2,
  SUCCESS = 3,
}

export const mappingColorCheckingStatus: {
  [key: number]: (typeof ColorList)[keyof typeof ColorList];
} = {
  [CheckingStatus.PROCESSING]: ColorList.WAITING,
  [CheckingStatus.SUCCESS]: ColorList.SUCCESS,
  [CheckingStatus.FAILURE]: ColorList.FAIL,
};

export const useColumns = (): ColumnsType<IColumnExportNumberPartner> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const navigate = useNavigate();
  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadResultFile = useCallback(
    (url = '') => {
      handleDownloadFile({
        uri: url,
      });
    },
    [handleDownloadFile]
  );
  return [
    {
      title: 'STT',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },

    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      width: 130,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Kho xuất',
      dataIndex: 'stockName',
      width: 130,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Kho Đối tác',
      dataIndex: 'ieStockName',
      width: 130,
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
      width: 160,
      render(value, record) {
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
      width: 120,
      render(value) {
        const textFormatDate = value ? dayjs(value).format(formatDate) : '';
        const textFormatDateTime = value
          ? dayjs(value).format(formatDateTime)
          : '';
        return (
          <Tooltip title={textFormatDateTime} placement="topLeft">
            <Text>{textFormatDate}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái kiểm tra',
      dataIndex: 'uploadStatus',
      width: 150,
      align: 'left',
      render: (value, record) => {
        if (!value) return null;
        const text = `${record.uploadStatusName}${
          record?.metadata?.checkProgress && value === NumberStatus.PROCESSING
            ? ` - ${record?.metadata?.checkProgress}%`
            : ''
        }`;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag color={mappingColorCheckingStatus[value]}>{text}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kết quả kiểm tra',
      width: 150,
      align: 'left',
      render: (_, record) => {
        if (record.uploadStatus === 2) {
          return (
            <Text>
              File kết quả:
              <Typography.Text
                style={{
                  color: 'green',
                  textDecoration: 'underline',
                  fontStyle: 'italic',
                  marginLeft: '4px',
                }}
                onClick={() =>
                  handleDownloadResultFile(record.resultCheckFile.fileUrl)
                }
                className="text-red-600 underline cursor-pointer"
              >
                File
              </Typography.Text>
            </Text>
          );
        }
        if (record.uploadStatus === 1) {
          return (
            <Tooltip
              placement="topLeft"
              title={`Tiến độ kiểm tra: ${
                record?.metadata?.checkProgress ?? 0
              }%`}
            >
              <Text>
                Tiến độ kiểm tra: {record?.metadata?.checkProgress ?? 0}%
              </Text>
            </Tooltip>
          );
        }
        return null;
      },
    },
    {
      title: 'Trạng thái thực hiện',
      dataIndex: 'transStatusName',
      width: 150,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <CTag
              bordered={false}
              color={mappingColorTransStatus[record.transStatus]}
            >
              {value}
            </CTag>
          </Tooltip>
        );
      },
    },

    {
      title: 'Kết quả',
      dataIndex: 'result',
      width: 150,
      render: (value, record) => {
        const succeededNumber = record?.succeededNumber;
        const failedNumber = record?.failedNumber;
        return (
          <div>
            {record.stepStatus >= 3 ? (
              <div className="flex flex-col items-start">
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thành công: ${succeededNumber}`}
                >
                  <Text>Số lượng thành công: {succeededNumber}</Text>
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thất bại: ${failedNumber ?? ''}`}
                >
                  <Text>Số lượng thất bại: {failedNumber}</Text>
                </Tooltip>
                <Text>
                  File kết quả:
                  <Typography.Text
                    style={{
                      color: 'green',
                      textDecoration: 'underline',
                      fontStyle: 'italic',
                      marginLeft: '4px',
                    }}
                    onClick={() =>
                      handleDownloadResultFile(record.uploadFile.fileUrl)
                    }
                    className="text-red-600 underline cursor-pointer"
                  >
                    File
                  </Typography.Text>
                </Text>
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: 180,
      align: 'center',
      fixed: 'right',
      render(value, record) {
        return (
          <WrapperActionTable>
            <CButtonDetail
              type="default"
              onClick={() =>
                navigate(pathRoutes.exportNumberPartnerView(record.id))
              }
            >
              Chi tiết
            </CButtonDetail>
          </WrapperActionTable>
        );
      },
    },
  ];
};
