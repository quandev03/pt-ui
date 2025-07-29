import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import {
  mappingColorNumberStatus,
  NumberStatus,
} from '@react/constants/status';
import { Dropdown, Tooltip } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { ColumnsType } from 'antd/es/table';
import {
  IFileInfo,
  INumberTransactionDetail,
} from 'apps/Internal/src/app/types';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import {
  ApprovalStatus,
  mappingColorApprovalStatus,
  mappingColorTransStatus,
  NumberProcessType,
  NumberTransactionStatus,
} from 'apps/Internal/src/constants/constants';
import dayjs from 'dayjs';

export const DEFAULT_PARAMS = {
  page: 0,
  size: 20,
};

export enum TransferMoveTypeEnum {
  INTERNAL = 1,
  OTHER = 2,
}
export const TRANSFER_MOVE_TYPE_OPTION = [
  { value: TransferMoveTypeEnum.INTERNAL, label: 'Nội bộ' },
  { value: TransferMoveTypeEnum.OTHER, label: 'Khác' },
];

export const downloadFile = (
  file: Blob,
  name?: string,
  createdDate?: string
) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const padZero = (num: number) => num.toString().padStart(2, '0');

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
  };

  // Ví dụ sử dụng
  const formattedDate = createdDate && formatDate(createdDate);

  const blobFile = new Blob([file], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blobFile);
  const link = document.createElement('a');
  link.href = url;
  if (typeof file === 'string') {
    link.setAttribute(
      'download',
      name ? name || 'Danh sách điều chuyển số' : file
    );
  }

  if (file instanceof Blob) {
    if (createdDate) {
      link.setAttribute(
        'download',
        `Danh_sach_dieu_chuyen_so-${formattedDate}`
      );
    } else {
      link.setAttribute('download', 'Danh sách điều chuyển số');
    }
  }

  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export const getColumns = (
  handleDownload: (record?: IFileInfo) => void,
  onViewProcessApproval: (id: number) => void,
  onCancel: (id: number) => void,
  onView: (id: number) => void
): ColumnsType<INumberTransactionDetail> => {
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Loại điều chuyển',
      dataIndex: 'moveTypeName',
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
      title: 'Kiểu điều chuyển',
      dataIndex: 'processTypeName',
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
      title: 'Kho xuất',
      dataIndex: 'stockName',
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
      title: 'Kho nhận',
      dataIndex: 'ieStockName',
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
                    onClick={() => handleDownload(record.resultCheckFile)}
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
      title: 'Trạng thái phê duyệt',
      dataIndex: 'approvalStatus',
      width: 160,
      align: 'left',
      render: (value, record) => {
        if (!value) return null;
        if (record.moveType === 1) {
          return null;
        }
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
      title: 'Trạng thái thực hiện',
      dataIndex: 'transStatus',
      width: 160,
      align: 'left',
      render: (value, record) => {
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
      title: 'Kết quả',
      width: 200,
      align: 'left',
      render: (__, record) => {
        const succeededNumber = record?.succeededNumber;
        const failedNumber = record?.failedNumber;
        return (
          <div>
            {record.processType === NumberProcessType.BATCH &&
            record.stepStatus === 3 ? (
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
                    onClick={() => handleDownload(record.resultFile)}
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
      title: 'Thao tác',
      dataIndex: 'action',
      width: 180,
      fixed: 'right',
      render(_, record) {
        const id = record && record.id;
        const items: ItemType[] = [];
        if (record.moveType === 2) {
          items.push({
            key: ActionsTypeEnum.READ,
            onClick: () => onViewProcessApproval(id),
            label: <Text>Tiến độ phê duyệt</Text>,
          });
        }
        if (
          record.approvalStatus === ApprovalStatus.WAITING_APPROVAL &&
          record.transStatus === NumberTransactionStatus.PRE_START
        ) {
          items.push({
            key: ActionsTypeEnum.DELETE,
            onClick: () => {
              onCancel(id);
            },
            label: <Text type="danger">Hủy điều chuyển</Text>,
          });
        }
        return (
          <WrapperActionTable>
            <CButtonDetail onClick={() => onView(id)} />
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
};
