import { CButtonDetail } from '@react/commons/Button';
import { CModalConfirm } from '@react/commons/index';
import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import {
  DeliveryOrderApprovalStatusList,
  mappingColorNumberStatus,
  NumberStatus,
} from '@react/constants/status';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  IFileInfo,
  INumberTransactionDetail,
} from 'apps/Internal/src/app/types';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalViewApprovalProcess from 'apps/Internal/src/components/ModalViewApprovalProcess';
import {
  mappingColorApprovalStatus,
  mappingColorTransStatus,
  NumberProcessType,
} from 'apps/Internal/src/constants/constants';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import useRevokeNumberStore from 'apps/Internal/src/modules/UploadNumber/store';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useCancel from '../queryHook/useCancel';
import { useListRevokeNumber } from '../queryHook/useListRevokeNumber';
import Header from './Header';

const Body: React.FC = () => {
  const { mutate: cancelRecallNumber } = useCancel();
  const handleCancel = useCallback(
    (id: number) => {
      CModalConfirm({
        message: 'Bạn có chắc chắn hủy thu hồi số không?',
        onOk: () => id && cancelRecallNumber(id),
      });
    },
    [cancelRecallNumber]
  );

  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadResult = useCallback(
    (record?: IFileInfo) => {
      handleDownloadFile({
        uri: record?.fileUrl ?? '',
      });
    },
    [handleDownloadFile]
  );

  const { setIsOpenModalApprovalProgress, isOpenModalApprovalProgress } =
    useRevokeNumberStore();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [recordId, setRecordId] = useState<number>(0);
  const handleAction = useCallback(
    (id: number) => {
      setRecordId(id);
      setIsOpenModalApprovalProgress(true);
    },
    [setIsOpenModalApprovalProgress, recordId]
  );
  const navigate = useNavigate();
  const columns: ColumnsType<INumberTransactionDetail> = [
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
      title: 'Kiểu thu hồi',
      dataIndex: 'processType',
      width: 120,
      align: 'left',
      render(value, record) {
        const text = Number(value) === 1 ? 'Đơn lẻ' : 'Theo lô';
        return (
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Kho thu hồi',
      dataIndex: 'stockName',
      width: 180,
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
      title: 'Kho nhận',
      dataIndex: 'ieStockName',
      width: 180,
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
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 180,
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
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render(value) {
        const text = dayjs(value).format(formatDate);
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{text}</Text>
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
                    onClick={() => handleDownloadResult(record.resultCheckFile)}
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
      title: 'Trạng thái phê duyệt',
      dataIndex: 'approvalStatus',
      width: 180,
      align: 'left',
      render(value, record) {
        if (!value) return null;
        return (
          <Tooltip title={record.approvalStatusName} placement="topLeft">
            <CTag color={mappingColorApprovalStatus[value]}>
              {record.approvalStatusName}
            </CTag>
          </Tooltip>
        );
      },
    },

    {
      title: 'Trạng thái thực hiện',
      dataIndex: 'transStatus',
      width: 180,
      align: 'left',
      render(value, record) {
        if (!value) return null;
        return (
          <Tooltip title={record.transStatusName} placement="topLeft">
            <CTag color={mappingColorTransStatus[value]}>
              {record.transStatusName}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kết quả thực hiện',
      width: 200,
      align: 'left',
      render: (_, record) => {
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
                    onClick={() => handleDownloadResult(record.resultFile)}
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
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: ActionsTypeEnum.READ,
            onClick: () => {
              handleAction(record.id);
            },
            label: <Text>Tiến độ phê duyệt</Text>,
          },
        ];
        if (record.approvalStatus === DeliveryOrderApprovalStatusList.PENDING) {
          items.push({
            key: ActionsTypeEnum.DELETE,
            onClick: () => {
              handleCancel(record.id);
            },
            label: <Text type="danger">Hủy thu hồi</Text>,
          });
        }
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => navigate(pathRoutes.revokeNumberView(record.id))}
            />
            <Dropdown
              menu={{ items: items }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="iconMore" />
            </Dropdown>
          </WrapperActionTable>
        );
      },
    },
  ];
  const { data: listRevokeNumber, isLoading: loadingData } =
    useListRevokeNumber(queryParams(params));

  return (
    <>
      <Header />
      <CTable
        columns={columns}
        dataSource={listRevokeNumber?.content}
        loading={loadingData}
        pagination={{
          total: listRevokeNumber?.totalElements,
        }}
      />
      <ModalViewApprovalProcess
        open={isOpenModalApprovalProgress}
        onClose={() => setIsOpenModalApprovalProgress(false)}
        objectName="ISDN_TRANSACTION"
        id={recordId}
      />
    </>
  );
};

export default Body;
