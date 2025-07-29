import { CButtonDetail } from '@react/commons/Button';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { getCustomerStatusString, ISubDocumentHistoryDTO } from '../types';
import { ExtendedColumnsType } from '@react/commons/TableSearch';
import { ColumnsType } from 'antd/lib/table';
import { AnyElement, IParamsRequest } from '@react/commons/types';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { ItemConfig as IdTypeData } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { getDate } from '@react/utils/datetime';
import CTag from '@react/commons/Tag';
import {
  AuditStatusColor,
  BinaryStatusColor,
  CensorshipStatusColor,
  CustomerTypeEnum,
} from '../../VerificationList/types';
export const getColumnsTablePostCheckList = (
  params: IParamsRequest,
  idTypeData: IdTypeData[],
  approvalStatusData: { label: string; value: string }[],
  auditStatusData: { label: string; value: string }[],
  actions: string[],
  {
    onAction,
  }: {
    onAction: (id: string) => void;
  }
): ExtendedColumnsType<AnyElement> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      searchDisiable: true,
      render: (_, __, index) => (
        <Text>{index + 1 + params.page * params.size}</Text>
      ),
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNo',
      width: 150,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Mã KH',
      dataIndex: 'customerCode',
      width: 150,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Loại KH',
      dataIndex: 'custType',
      align: 'left',
      width: 100,

      render(value) {
        const renderedValue =
          CustomerTypeEnum[value as keyof typeof CustomerTypeEnum];
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            {renderedValue}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'phoneNumber',
      width: 140,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Tên KH',
      dataIndex: 'name',
      width: 150,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày sinh',
      values: (value) => getDate(value),
      dataIndex: 'birthDate',
      width: 120,
      render: (value) => (
        <Tooltip title={getDate(value)} placement="topLeft">
          <Text>{getDate(value)}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Loại GTTT',
      dataIndex: 'idType',
      width: 110,
      render: (value) => {
        const idType = idTypeData.find((item) => item.value === value)?.code;
        return (
          <Tooltip title={idType} placement="topLeft">
            <Text>{idType}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số GTTT',
      dataIndex: 'idNo',
      width: 150,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày kích hoạt',
      dataIndex: 'activeDate',
      width: 150,
      values: (value) => getDate(value),
      render: (value) => (
        <Tooltip
          title={getDate(value, DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          <Text>{getDate(value, DateFormat.DATE_TIME)}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Tên đối tác/ đơn vị',
      dataIndex: 'clientName',
      width: 170,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái KH',
      dataIndex: 'customerStatus',
      width: 150,
      values: (value) => getCustomerStatusString(value),
      render: (value) => {
        const text = getCustomerStatusString(value);
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              color={BinaryStatusColor[value as keyof typeof BinaryStatusColor]}
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'User kiểm duyệt',
      dataIndex: 'assignUserName',
      width: 150,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái kiểm duyệt',
      dataIndex: 'approveStatus',
      width: 190,
      values: (value) =>
        approvalStatusData.find((item) => Number(item.value) === value)
          ?.label ?? '',
      render: (value) => {
        const text = approvalStatusData.find(
          (item) => Number(item.value) === value
        )?.label;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              color={
                CensorshipStatusColor[
                  value as keyof typeof CensorshipStatusColor
                ]
              }
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày kiểm duyệt',
      dataIndex: 'approveDate',
      width: 150,
      values: (value) => getDate(value),
      render: (value) => (
        <Tooltip
          title={getDate(value, DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          <Text>{getDate(value, DateFormat.DATE_TIME)}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'User tiền kiểm',
      dataIndex: 'preApprovalUserName',
      width: 150,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày hậu kiểm',
      dataIndex: 'auditDate',
      width: 150,
      values: (value) => dayjs(value).format(formatDate),
      render: (value) => (
        <Tooltip
          title={getDate(value, DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          <Text>{getDate(value, DateFormat.DATE_TIME)}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái hậu kiểm',
      dataIndex: 'auditStatus',
      width: 170,
      values: (value) =>
        auditStatusData.find((item) => Number(item.value) === value)?.label ??
        '',
      render: (value) => {
        const text = auditStatusData.find(
          (item) => Number(item.value) === value
        )?.label;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              color={AuditStatusColor[value as keyof typeof AuditStatusColor]}
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'User phát triển',
      dataIndex: 'userDev',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 150,
      fixed: 'right',
      searchDisiable: true,
      hidden: !actions.includes(ActionsTypeEnum.READ),
      render: (_, record) => {
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() => {
                onAction(record.id);
              }}
            />
          </WrapperActionTable>
        );
      },
    },
  ];
};
export const columnsHistory = (): ColumnsType<ISubDocumentHistoryDTO> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_: any, __: any, index: number) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Ngày thay đổi',
      dataIndex: 'createdDate',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={dayjs(value).format(formatDateTime)}>
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người thay đổi',
      dataIndex: 'createdBy',
      align: 'left',
      width: 120,
      render(value: string) {
        return (
          <Tooltip title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
