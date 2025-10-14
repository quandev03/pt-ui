import {
  CButtonDetail,
  CTag,
  decodeSearchParams,
  formatDate,
  RenderCell,
  Text,
  usePermissions,
  WrapperActionTable,
} from '@vissoft-react/common';
import { TableColumnsType, Tooltip, Typography } from 'antd';
import { pathRoutes } from 'apps/Internal/src/routers';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import {
  TransactionStatusTagMap,
  UploadStatus,
  UploadStatusTagMap,
} from '../../ListOfServicePackage/types';
import { IFileInfo, IResponseUploadNumber } from '../types';

export const useColumnTable = ({
  onDownload,
}: {
  onDownload: (isCheckFile: boolean, record?: IFileInfo) => void;
}) => {
  const {
    params: { ISDN_TRANSACTION_UPLOAD_STATUS, ISDN_TRANSACTION_TRANS_STATUS },
  } = useConfigAppStore();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const navigate = useNavigate();
  const handleDetail = useCallback(
    (record: IResponseUploadNumber) => {
      navigate(pathRoutes.uploadNumberView(record.id));
    },
    [navigate]
  );
  const columns: TableColumnsType<IResponseUploadNumber> = useMemo(() => {
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
        title: 'Khách hàng',
        dataIndex: 'createdBy',
        width: 200,
        align: 'left',
        render(value) {
          return <RenderCell value={value} tooltip={value} />;
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: 120,
        align: 'left',
        render(value) {
          const formatted = value
            ? dayjs(value, 'DD/MM/YYYY HH:mm:ss').format(formatDate)
            : '';

          return <RenderCell value={formatted} tooltip={value ?? ''} />;
        },
      },
      
      {
        title: 'Mã hợp đồng',
        dataIndex: 'transStatus',
        width: 150,
        align: 'left',
        render: (value) => {
          const text =
            ISDN_TRANSACTION_TRANS_STATUS.find(
              (item) => String(item.code) === String(value)
            )?.value || '';
          return (
            <CTag
              type={
                TransactionStatusTagMap[
                  value as keyof typeof TransactionStatusTagMap
                ]
              }
            >
              {text}
            </CTag>
          );
        },
      },
      {
        title: 'Xem chi tiết',
        width: 200,
        align: 'left',
        render: (_, record) => {
          return (
            <div>
              {record.stepStatus === 3 && record.resultFile ? (
                <>
                  <Tooltip
                    placement="topLeft"
                    title={`Số lượng thành công: ${
                      record.succeededNumber ?? ''
                    }`}
                  >
                    <Text>Số lượng thành công: {record.succeededNumber}</Text>
                  </Tooltip>
                  <Tooltip
                    placement="topLeft"
                    title={`Số lượng thất bại: ${record.failedNumber ?? ''}`}
                  >
                    <Text>Số lượng thất bại: {record.failedNumber}</Text>
                  </Tooltip>
                  <Text className="!flex w-full">
                    File kết quả:
                    <Typography.Text
                      style={{
                        color: 'green',
                        textDecoration: 'underline',
                        fontStyle: 'italic',
                        marginLeft: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => onDownload(false, record?.resultFile)}
                    >
                      File
                    </Typography.Text>
                  </Text>
                </>
              ) : null}
            </div>
          );
        },
      },
      {
        title: 'Thao tác',
        align: 'center',
        width: 150,
        fixed: 'right',
        render(_, record) {
          return (
            <WrapperActionTable>
              {permission.canRead && (
                <CButtonDetail onClick={() => handleDetail(record)} />
              )}
            </WrapperActionTable>
          );
        },
      },
    ];
  }, [handleDetail, permission, params]);
  return { columns };
};
