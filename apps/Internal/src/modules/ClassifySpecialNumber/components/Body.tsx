import { CButtonDetail } from '@react/commons/Button';
import CTable from '@react/commons/Table';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Tag, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useListClassifySpecialNumber } from '../queryHook/useListClassifySpecialNumber';
import Header from './Header';
import React, { useCallback } from 'react';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import {
  IFileInfo,
  INumberTransactionDetail,
} from 'apps/Internal/src/app/types';
import {
  mappingColorApprovalStatus,
  mappingColorTransStatus,
  NumberProcessType,
  OPTION_NUMBER_PROCESS_TYPE,
} from 'apps/Internal/src/constants/constants';
import { formatDate, formatDateTime } from '@react/constants/moment';
import CTag from '@react/commons/Tag';
import {
  mappingColorNumberStatus,
  NumberStatus,
} from '@react/constants/status';

const Body = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: dataTable, isLoading: loadingData } =
    useListClassifySpecialNumber(queryParams(params));

  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadResultFile = useCallback(
    (record?: IFileInfo) => {
      handleDownloadFile({
        uri: record?.fileUrl ?? '',
      });
    },
    [handleDownloadFile]
  );

  const columns: ColumnsType<INumberTransactionDetail> = [
    {
      title: 'STT',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{params.page * params.size + (index + 1)}</Text>;
      },
    },

    {
      title: 'Kiểu gán số',
      dataIndex: 'processType',
      width: 100,
      render(value) {
        const selectedOption = OPTION_NUMBER_PROCESS_TYPE.find(
          (option) => option.value === value
        );
        const label = selectedOption?.label;
        return (
          <Tooltip title={label} placement="topLeft">
            <Text>{label}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 200,
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
            <CTag color={mappingColorNumberStatus[value]}>{text}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kết quả kiểm tra',
      width: 200,
      align: 'left',
      render: (_, record) => {
        const succeededNumber = record?.validSucceededNumber;
        const failedNumber = record?.validFailedNumber;
        return (
          <div>
            {record.processType === NumberProcessType.BATCH &&
            record.stepStatus &&
            record.stepStatus >= 2 &&
            record.resultCheckFile ? (
              <>
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thành công: ${succeededNumber}`}
                >
                  <Text width="100%">
                    Số lượng thành công: {succeededNumber}
                  </Text>
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thất bại: ${failedNumber}`}
                >
                  <Text width="100%">Số lượng thất bại: {failedNumber}</Text>
                </Tooltip>
                <Text className="!flex w-full">
                  File kết quả:
                  <div
                    style={{
                      color: 'green',
                      textDecoration: 'underline',
                      fontStyle: 'italic',
                      marginLeft: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      handleDownloadResultFile(record?.resultCheckFile)
                    }
                  >
                    File
                  </div>
                </Text>
              </>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      width: 200,
      render(value, record) {
        const succeededNumber = record?.succeededNumber;
        const failedNumber = record?.failedNumber;
        return (
          <div>
            {record.processType === NumberProcessType.BATCH &&
            record.stepStatus === 3 &&
            record.resultFile ? (
              <div className="flex flex-col items-start">
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thành công: ${succeededNumber}`}
                >
                  <Text width="100%">
                    Số lượng thành công: {succeededNumber}
                  </Text>
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thất bại: ${failedNumber ?? ''}`}
                >
                  <Text width="100%">Số lượng thất bại: {failedNumber}</Text>
                </Tooltip>
                <Text className="!flex w-full">
                  File kết quả:
                  <div
                    style={{
                      color: 'green',
                      textDecoration: 'underline',
                      fontStyle: 'italic',
                      marginLeft: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDownloadResultFile(record.resultFile)}
                  >
                    File
                  </div>
                </Text>
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Trạng thái thực hiện',
      dataIndex: 'transStatus',
      width: 180,
      align: 'left',
      render: (value, record) => {
        if (!value) return null;
        return (
          <Tooltip title={record.transStatusName} placement="topLeft">
            <Tag bordered={false} color={mappingColorTransStatus[value]}>
              {record.transStatusName}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 180,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text
              style={{
                display: 'inline-block',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </Text>
          </Tooltip>
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
                navigate(pathRoutes.classifySpecialNumberView(record.id))
              }
            >
              Detail
            </CButtonDetail>
          </WrapperActionTable>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <CTable
        rowKey={'id'}
        columns={columns}
        dataSource={dataTable?.content ?? []}
        loading={loadingData}
        pagination={{
          total: dataTable?.totalElements ?? 0,
        }}
      />
    </>
  );
};

export default Body;
