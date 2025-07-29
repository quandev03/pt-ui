import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, IParamsRequest } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { formatDate, formatDateTime } from '@react/constants/moment';
import {
  mappingColorNumberStatus,
  NumberStatus,
} from '@react/constants/status';
import { Dropdown, MenuProps, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  IFileInfo,
  INumberTransactionDetail,
} from 'apps/Internal/src/app/types';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import {
  ApprovalStatus,
  mappingColorApprovalStatus,
  mappingColorTransStatus,
  NumberProcessType,
  NumberTransactionStatus,
} from 'apps/Internal/src/constants/constants';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { IPhoneNumberSelect } from 'apps/Internal/src/modules/DistributeNumber/type';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

export const columnsPhoneNumberSelect = (
  params: IParamsRequest
): ColumnsType<IPhoneNumberSelect> => {
  return [
    {
      title: 'STT',
      dataIndex: 'id',
      width: 120,
      ellipsis: { showTitle: false },
      render: (_, __, index) => (
        <Text>{index + 1 + (params.page - 1) * params.size}</Text>
      ),
    },
    {
      title: 'Số',
      dataIndex: 'isdn',
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Nhóm số',
      dataIndex: 'groupCode',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Định dạng số',
      dataIndex: 'generalFormat',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
  ];
};

export const columnsUploadEachPhoneNumber = ({
  handleRemoveItem,
  actionMode,
}: {
  handleRemoveItem: (index: number | string) => void;
  actionMode: ACTION_MODE_ENUM;
}): ColumnsType<IPhoneNumberSelect> => {
  return [
    {
      title: 'STT',
      width: 120,
      render: (_, __, index) => (
        <Tooltip title={index + 1} placement="topLeft">
          <Text>{index + 1}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Số',
      dataIndex: 'isdn',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Nhóm số',
      dataIndex: 'groupCode',
      render: (value) => (
        <Tooltip title={value}>
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Định dạng số',
      dataIndex: 'generalFormat',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: '',
      width: 80,
      render: (_, record) => {
        if (actionMode === ACTION_MODE_ENUM.VIEW) {
          return null;
        }
        return (
          <FontAwesomeIcon
            fontSize={20}
            icon={faMinus}
            onClick={() => handleRemoveItem(record.id)}
            className="mr-6 cursor-pointer"
          />
        );
      },
    },
  ];
};
export const columnsList = (
  params: IParamsRequest,
  onDownload: (record?: IFileInfo) => void,
  actionByRole: ActionsTypeEnum[],
  onCancelDistributeNumber: (id: number) => void,
  onViewPreviewApproved: (id: number) => void
): ColumnsType<INumberTransactionDetail> => {
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      ellipsis: { showTitle: false },
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Kiểu phân phối',
      dataIndex: 'processTypeName',
      width: 150,
      align: 'left',
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Kho xuất',
      dataIndex: 'stockName',
      width: 150,
      align: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Kho nhận',
      dataIndex: 'ieStockName',
      width: 150,
      align: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 250,
      align: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render: (value) => (
        <Tooltip
          title={dayjs(value).format(formatDateTime)}
          placement="topLeft"
        >
          {dayjs(value).format(formatDate)}
        </Tooltip>
      ),
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
                    onClick={() => onDownload(record.resultCheckFile)}
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
      render: (value, record) => {
        if (!value) return null;
        return (
          <Tooltip title={record.approvalStatusName} placement="topLeft">
            <Tag bordered={false} color={mappingColorApprovalStatus[value]}>
              {record.approvalStatusName}
            </Tag>
          </Tooltip>
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
      title: 'Kết quả',
      dataIndex: 'result',
      width: 200,
      align: 'left',
      render: (value, record) => {
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
                    onClick={() => onDownload(record.resultFile)}
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
      fixed: 'right',
      width: 150,
      align: 'center',
      render: ({ id, numberType }, record) => {
        const items: MenuProps['items'] = [
          {
            key: ActionsTypeEnum.READ,
            onClick: () => {
              onViewPreviewApproved(record.id!);
            },
            label: <Text>Tiến độ phê duyệt</Text>,
          },
        ];

        if (
          actionByRole.includes(ActionsTypeEnum.CANCEL) &&
          record.approvalStatus === ApprovalStatus.WAITING_APPROVAL &&
          record.transStatus === NumberTransactionStatus.PRE_START
        ) {
          items.push({
            key: ActionsTypeEnum.CANCEL,
            onClick: () => {
              ModalConfirm({
                message: 'Bạn có chắc chắn muốn hủy phân phối?',
                handleConfirm: () => {
                  onCancelDistributeNumber(record.id!);
                },
              });
            },
            label: <Text type="danger">Hủy phân phối</Text>,
          });
        }

        return (
          <WrapperActionTable>
            <Link to={pathRoutes.distributeNumberView(record?.id)}>
              <CButtonDetail type="default">Chi tiết</CButtonDetail>
            </Link>
            <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
              <IconMore className="cursor-pointer" />
            </Dropdown>
          </WrapperActionTable>
        );
      },
    },
  ];
};
