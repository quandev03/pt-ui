import { CButtonDetail } from '@react/commons/Button';
import { ExtendedColumnsType } from '@react/commons/TableSearch';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { IParamsRequest } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import {
  DeliveryOrderApprovalStatusList,
  NumberStatus,
} from '@react/constants/status';
import { Dropdown, Tooltip, Typography } from 'antd';
import {
  IFileInfo,
  INumberTransactionDetail,
} from 'apps/Internal/src/app/types';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import {
  mappingColorApprovalStatus,
  mappingColorTransStatus,
} from 'apps/Internal/src/constants/constants';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { mappingColorUploadStatus } from '../types';

export const getColumnsTableUploadNumber = (
  params: IParamsRequest,
  {
    onView,
    onCancelUpload,
    onAction,
    onDownload,
  }: {
    onView: (id: number) => void;
    onAction: (id: number) => void;
    onCancelUpload: (id: number) => void;
    onDownload: (record?: IFileInfo) => void;
  }
): ExtendedColumnsType<INumberTransactionDetail> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: <FormattedMessage id="Người tạo" />,
      dataIndex: 'createdBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="Ngày tạo" />,
      dataIndex: 'createdDate',
      width: 120,
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
            <CTag color={mappingColorUploadStatus[value]}>{text}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kết quả kiểm tra',
      width: 150,
      align: 'left',
      render: (_, record) => {
        const succeededNumber = record?.validSucceededNumber;
        const failedNumber = record?.validFailedNumber;
        return (
          <div>
            {record.stepStatus &&
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
      title: 'Trạng thái phê duyệt',
      dataIndex: 'approvalStatus',
      width: 150,
      align: 'left',
      render: (value, record) => {
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
      title: 'Trạng thái thực hiện',
      dataIndex: 'transStatus',
      width: 150,
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
      title: 'Kết quả thực hiện',
      width: 200,
      align: 'left',
      render: (_, record) => {
        return (
          <div>
            {record.stepStatus === 3 && record.resultFile ? (
              <>
                <Tooltip
                  placement="topLeft"
                  title={`Số lượng thành công: ${record.succeededNumber ?? ''}`}
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
                    onClick={() => onDownload(record.resultFile)}
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
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 150,
      fixed: 'right',
      searchDisiable: true,
      render(_, record) {
        const items = [
          {
            key: ActionsTypeEnum.UPDATE,
            label: (
              <Text
                onClick={() => {
                  onAction(record.id);
                }}
              >
                <FormattedMessage id={'Tiến độ phê duyệt'} />
              </Text>
            ),
          },
          ...(record.approvalStatus === DeliveryOrderApprovalStatusList.PENDING
            ? [
                {
                  key: ActionsTypeEnum.DELETE,
                  label: (
                    <Text
                      onClick={() => onCancelUpload(record.id)}
                      type="danger"
                    >
                      <FormattedMessage id={'Hủy Upload'} />
                    </Text>
                  ),
                },
              ]
            : []),
        ];
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => {
                onView(record.id);
              }}
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
};
