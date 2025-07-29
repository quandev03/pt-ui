import { Text } from '@react/commons/Template/style';
import { AnyElement, ModelStatus } from '@react/commons/types';
import { getFilter } from '@react/utils/index';
import { Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  AuditStatus,
  AuditStatusColor,
  BinaryStatusColor,
  CensorshipStatus,
  CensorshipStatusColor,
  CENSORSHIPSTT,
  CustomerTypeEnum,
  IdDocument,
  optionsActiveChannel,
  optionsApproveStatus,
  optionsAuditStatus,
  optionsCustomerType,
  optionsIdDocument,
} from '../types';
import {
  formatDate,
  formatDateBe,
  formatDateTime,
} from '@react/constants/moment';
import dayjs, { Dayjs } from 'dayjs';
import CTag from '@react/commons/Tag';
import { includes } from 'lodash';
import { ActionsTypeEnum, StatusEnum } from '@react/constants/app';
import { CButtonDetail } from '@react/commons/Button';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useMemo } from 'react';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';

export const useColumnVerification = (
  filter: AnyElement,
  handleFilterChangeState: (
    name: string,
    value: string | null | undefined | Dayjs
  ) => void,
  paramsFake: AnyElement,
  isAdmin: boolean,
  actionByRole: string[],
  setIsDisableSync: (value: boolean) => void,
  navigate: (path: string) => void,
  auditRejectReasons: AnyElement[],
  optionsActiveChannel: AnyElement[]
) => {
  const columns = useMemo<ColumnsType<AnyElement>>(() => {
    return [
      {
        title: 'STT',
        align: 'left',
        width: 50,
        fixed: 'left',
        render(_: any, __: any, index: number) {
          const stt = index + 1 + paramsFake.page * paramsFake.size;
          return <Text>{stt}</Text>;
        },
      },
      {
        title: 'Số hợp đồng',
        dataIndex: 'contractNo',
        align: 'left',
        width: 135,
        render(value: string) {
          return (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'contractNo',
          type: 'Input',
          defaultValue: filter.contractNo as string,
          placeholder: 'Nhập số hợp đồng',
          onFilter: handleFilterChangeState,
        }),
      },
      {
        title: 'Mã KH',
        align: 'left',
        dataIndex: 'customerCode',
        width: 160,
        render(value: string) {
          return (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'customerCode',
          type: 'Input',
          defaultValue: filter.customerCode as string,
          placeholder: 'Nhập mã KH',
          onFilter: handleFilterChangeState,
        }),
      },
      {
        title: 'Loại KH',
        dataIndex: 'custType',
        align: 'left',
        width: 100,
        render(value: string) {
          const renderedValue =
            CustomerTypeEnum[value as keyof typeof CustomerTypeEnum];
          return (
            <Tooltip title={renderedValue} placement="topLeft">
              {renderedValue}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'custType',
          type: 'Select',
          defaultValue: filter.custType as string,
          placeholder: 'Chọn loại KH',
          onFilter: handleFilterChangeState,
          options: optionsCustomerType,
        }),
      },
      {
        title: 'Số thuê bao',
        dataIndex: 'phoneNumber',
        align: 'left',
        width: 120,
        render(value: string) {
          return (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'phoneNumber',
          type: 'Input',
          defaultValue: filter.phoneNumber as string,
          placeholder: 'Nhập số thuê bao',
          onFilter: handleFilterChangeState,
        }),
      },
      {
        title: 'Tên KH',
        dataIndex: 'userName',
        align: 'left',
        width: 150,
        render(value: string) {
          return (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'userName',
          type: 'Input',
          defaultValue: filter.userName as string,
          placeholder: 'Nhập tên KH',
          onFilter: handleFilterChangeState,
        }),
      },
      {
        title: 'Ngày sinh',
        dataIndex: 'birthDate',
        align: 'left',
        width: 105,
        render(value: string) {
          return (
            <Tooltip
              title={
                dayjs(value).isValid() ? dayjs(value).format(formatDate) : ''
              }
              placement="topLeft"
            >
              {dayjs(value).isValid() ? dayjs(value).format(formatDate) : ''}
            </Tooltip>
          );
        },
        ...getFilter({
          name: 'birthDate',
          type: 'Date',
          defaultValue: filter.birthDate as Dayjs,
          onFilter: handleFilterChangeState,
          formatSubmit: formatDateBe,
        }),
      },
      {
        title: 'Loại GTTT',
        dataIndex: 'idType',
        align: 'left',
        width: 110,
        render(value: string) {
          return (
            <Tooltip
              title={IdDocument[value as keyof typeof IdDocument]}
              placement="topLeft"
            >
              {IdDocument[value as keyof typeof IdDocument]}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'idType',
          type: 'Select',
          defaultValue: filter.idType as string,
          placeholder: 'Chọn loại GTTT',
          onFilter: handleFilterChangeState,
          options: optionsIdDocument,
        }),
      },
      {
        title: 'Số GTTT',
        dataIndex: 'idNo',
        align: 'left',
        width: 130,
        render(value: string) {
          return (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'idNo',
          type: 'Input',
          defaultValue: filter.idNo as string,
          placeholder: 'Nhập số GTTT',
          onFilter: handleFilterChangeState,
        }),
      },
      {
        title: 'User kích hoạt',
        dataIndex: 'activeUser',
        align: 'left',
        width: 210,
        render(value: string) {
          return (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'activeUser',
          type: 'Input',
          defaultValue: filter.activeUser as string,
          placeholder: 'Nhập user kích hoạt',
          onFilter: handleFilterChangeState,
        }),
      },
      {
        title: 'Tên đối tác/đơn vị',
        dataIndex: 'clientName',
        align: 'left',
        width: 200,
        render(value: string) {
          return (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'clientName',
          type: 'Input',
          defaultValue: filter.clientName as string,
          placeholder: 'Nhập tên đối tác/đơn vị',
          onFilter: handleFilterChangeState,
        }),
      },
      {
        title: 'Ngày kích hoạt',
        dataIndex: 'activeDate',
        align: 'left',
        width: 180,
        render(value: string) {
          return (
            <Tooltip
              title={value ? dayjs(value).format(formatDateTime) : ''}
              placement="topLeft"
            >
              {value ? dayjs(value).format(formatDateTime) : ''}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'activeDate',
          type: 'Date',
          defaultValue: filter.activeDate as Dayjs,
          onFilter: handleFilterChangeState,
          formatSubmit: formatDateBe,
        }),
      },
      {
        title: 'Kênh kích hoạt',
        dataIndex: 'activeChannel',
        align: 'left',
        width: 140,
        render(value: string) {
          const renderedValue =
            optionsActiveChannel?.find((item) => item.value === value)?.name ||
            value;
          return (
            <Tooltip title={renderedValue} placement="topLeft">
              {renderedValue}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'activeChannel',
          type: 'Select',
          defaultValue: filter.activeChannel as string,
          placeholder: 'Chọn kênh kích hoạt',
          onFilter: handleFilterChangeState,
          options:
            optionsActiveChannel
              ?.filter((item) => Number(item.status) === ModelStatus.ACTIVE)
              .map((item) => ({
                label: item.name,
                value: item.value,
              })) || [],
        }),
      },
      {
        title: 'Trạng thái KH',
        dataIndex: 'customerStatus',
        align: 'left',
        width: 150,
        render(value: AnyElement) {
          return (
            <Tooltip
              title={value === 1 ? 'Đang hoạt động' : 'Chưa kích hoạt'}
              placement="topLeft"
            >
              <CTag
                color={
                  BinaryStatusColor[value as keyof typeof BinaryStatusColor]
                }
              >
                {value === 1 ? 'Đang hoạt động' : 'Chưa kích hoạt'}
              </CTag>
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'customerStatus',
          type: 'Select',
          defaultValue: filter.customerStatus as number,
          placeholder: 'Chọn trạng thái KH',
          onFilter: handleFilterChangeState,
          options: [
            {
              label: 'Đang hoạt động',
              value: 1,
            },
            {
              label: 'Chưa kích hoạt',
              value: 0,
            },
          ],
        }),
      },
      ...(isAdmin
        ? [
            {
              title: 'User kiểm duyệt',
              dataIndex: 'assignUserName',
              width: 210,
              render(value: string) {
                return (
                  <Tooltip title={value} placement="topLeft">
                    {value}
                  </Tooltip>
                );
              },
              ...getFilter<AnyElement, string | null | undefined>({
                name: 'assignUserName',
                type: 'Input',
                defaultValue: filter.assignUserName ?? '',
                placeholder: 'Nhập user kiểm duyệt',
                onFilter: handleFilterChangeState,
              }),
            },
          ]
        : []),
      {
        title: 'Trạng thái kiểm duyệt',
        dataIndex: 'approveStatus',
        width: 190,
        render(value: AnyElement) {
          return (
            <Tooltip
              title={CensorshipStatus[value as keyof typeof CensorshipStatus]}
              placement="topLeft"
            >
              <CTag
                color={
                  CensorshipStatusColor[
                    value as keyof typeof CensorshipStatusColor
                  ]
                }
              >
                {CensorshipStatus[value as keyof typeof CensorshipStatus]}
              </CTag>
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'approveStatus',
          type: 'Select',
          defaultValue: filter.approveStatus as string,
          placeholder: 'Chọn trạng thái kiểm duyệt',
          onFilter: handleFilterChangeState,
          options: optionsApproveStatus,
        }),
      },
      {
        title: 'Trạng thái cập nhật GT',
        dataIndex: 'docUpdateStatus',
        align: 'left' as const,
        width: 190,
        render(value: AnyElement) {
          let renderedValue = null;
          if (value === 0) {
            renderedValue = 'Chưa cập nhật';
          } else if (value === 1) {
            renderedValue = 'Đã cập nhật';
          }
          return (
            <Tooltip title={renderedValue} placement="topLeft">
              <CTag
                color={
                  BinaryStatusColor[value as keyof typeof BinaryStatusColor]
                }
              >
                {renderedValue}
              </CTag>
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'docUpdateStatus',
          type: 'Select',
          defaultValue: filter.docUpdateStatus as number,
          placeholder: 'Chọn trạng thái cập nhật GT',
          onFilter: handleFilterChangeState,
          options: [
            {
              label: 'Chưa cập nhật',
              value: 0,
            },
            {
              label: 'Đã cập nhật',
              value: 1,
            },
          ],
        }),
      },
      {
        title: 'Ngày cập nhật',
        dataIndex: 'docUpdateDate',
        align: 'left' as const,
        width: 140,
        render(value: AnyElement) {
          return (
            <Tooltip
              title={value ? dayjs(value).format(formatDateTime) : ''}
              placement="topLeft"
            >
              {value ? dayjs(value).format(formatDate) : ''}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'docUpdateDate',
          type: 'Date',
          defaultValue: filter.docUpdateDate as Dayjs,
          onFilter: handleFilterChangeState,
          formatSubmit: formatDateBe,
        }),
      },
      {
        title: 'Trạng thái hậu kiểm',
        dataIndex: 'auditStatus',
        align: 'left' as const,
        width: 170,
        render(value: AnyElement, record: AnyElement) {
          const renderedValue =
            record.approveStatus === CENSORSHIPSTT.Pending
              ? null
              : AuditStatus[value as keyof typeof AuditStatus];
          return (
            <Tooltip title={renderedValue} placement="topLeft">
              <CTag
                color={AuditStatusColor[value as keyof typeof AuditStatusColor]}
              >
                {renderedValue}
              </CTag>
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'auditStatus',
          type: 'Select',
          defaultValue: filter.auditStatus as number,
          placeholder: 'Chọn trạng thái hậu kiểm',
          onFilter: handleFilterChangeState,
          options: optionsAuditStatus,
        }),
      },
      {
        title: 'Thời gian phân công kiểm duyệt',
        dataIndex: 'assignDate',
        align: 'left',
        width: 220,
        render(value) {
          return (
            <Tooltip
              title={value ? dayjs(value).format(formatDateTime) : ''}
              placement="topLeft"
            >
              {value ? dayjs(value).format(formatDateTime) : ''}
            </Tooltip>
          );
        },
        ...getFilter<AnyElement, string | null | undefined>({
          name: 'assignDate',
          type: 'Date',
          defaultValue: filter.assignDate as Dayjs,
          onFilter: handleFilterChangeState,
          formatSubmit: formatDateBe,
        }),
      },
      ...(isAdmin
        ? [
            {
              title: 'Lý do hậu kiểm',
              dataIndex: 'auditRejectReasonCode',
              align: 'left' as const,
              width: 180,
              render(value: AnyElement) {
                const renderedValue = auditRejectReasons?.find(
                  (reason) => reason.code === value
                )?.name;
                return (
                  <Tooltip title={renderedValue} placement="topLeft">
                    {renderedValue}
                  </Tooltip>
                );
              },
              ...getFilter<AnyElement, string | null | undefined>({
                name: 'auditRejectReasonCode',
                type: 'Select',
                defaultValue: filter.auditRejectReasonCode as string,
                placeholder: 'Nhập lý do hậu kiểm',
                onFilter: handleFilterChangeState,
                options:
                  auditRejectReasons?.map((reason) => ({
                    label: reason.name,
                    value: reason.code,
                  })) || [],
              }),
            },
          ]
        : []),
      ...(isAdmin
        ? [
            {
              title: 'Trạng thái phân công',
              dataIndex: 'assignStatus',
              align: 'left' as const,
              width: 180,
              render(value: AnyElement) {
                const renderedValue =
                  value === 1 ? 'Đã phân công' : 'Chưa phân công';
                return (
                  <Tooltip title={renderedValue} placement="topLeft">
                    <CTag
                      color={
                        BinaryStatusColor[
                          value as keyof typeof BinaryStatusColor
                        ]
                      }
                    >
                      {renderedValue}
                    </CTag>
                  </Tooltip>
                );
              },
              ...getFilter<AnyElement, string | null | undefined>({
                name: 'assignStatus',
                type: 'Select',
                defaultValue: filter.assignStatus as number,
                placeholder: 'Chọn trạng thái phân công',
                onFilter: handleFilterChangeState,
                options: [
                  {
                    label: 'Đã phân công',
                    value: 1,
                  },
                  {
                    label: 'Chưa phân công',
                    value: 0,
                  },
                ],
              }),
            },
          ]
        : []),
      ...(!isAdmin
        ? [
            {
              title: 'Thao tác',
              align: 'center' as const,
              width: 150,
              fixed: 'right' as const,
              render: (value: AnyElement) => (
                <Space size="middle">
                  {includes(actionByRole, ActionsTypeEnum.READ) &&
                    (value.approveStatus === CENSORSHIPSTT.Pending ||
                      value.approveStatus === CENSORSHIPSTT.Recheck) && (
                      <CButtonDetail
                        title="Xem chi tiết kiểm duyệt"
                        onClick={() => {
                          setIsDisableSync(true);
                          navigate(
                            pathRoutes.verification_approve(value.subscriberId)
                          );
                        }}
                      />
                    )}
                  {includes(actionByRole, ActionsTypeEnum.READ) &&
                    value.approveStatus === CENSORSHIPSTT.UpdateRequired &&
                    value.docUpdateStatus === 1 && (
                      <CButtonDetail
                        title="Xem chi tiết cập nhật giấy tờ"
                        onClick={() =>
                          navigate(
                            pathRoutes.censorship_history_view(
                              value.subDocumentId
                            )
                          )
                        }
                      />
                    )}
                </Space>
              ),
            },
          ]
        : []),
    ];
  }, [
    filter,
    handleFilterChangeState,
    paramsFake,
    isAdmin,
    actionByRole,
    auditRejectReasons,
    setIsDisableSync,
    navigate,
    optionsActiveChannel,
  ]);
  return columns;
};
