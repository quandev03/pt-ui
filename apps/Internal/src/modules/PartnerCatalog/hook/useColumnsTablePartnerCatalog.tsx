import {
  ActionsTypeEnum,
  CButtonDetail,
  ColorList,
  CTag,
  formatDate,
  formatDateTime,
  IModeAction,
  IOption,
  IParamsRequest,
  StatusEnum,
  Text,
  TypeTagEnum,
  usePermissions,
  WrapperActionTable,
} from '@vissoft-react/common';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MoreVertical } from 'lucide-react';
import { IOrganizationUnitDTO } from '../types';
import { useMemo } from 'react';
import useConfigAppStore from '../../Layouts/stores';

export const useColumnsTablePartnerCatalog = (
  params: IParamsRequest,
  PARTNER_STATUS: IOption[],
  onAction: (type: IModeAction, record: IOrganizationUnitDTO) => void
) => {
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const columns: ColumnsType<IOrganizationUnitDTO> = useMemo(() => {
    return [
      {
        title: 'STT',
        align: 'left',
        width: 50,
        fixed: 'left',
        render(_, record, index) {
          return (
            <Text disabled={record.status !== StatusEnum.ACTIVE}>
              {index + 1 + params.page * params.size}
            </Text>
          );
        },
      },
      {
        title: 'Mã đối tác',
        dataIndex: 'orgCode',
        width: 150,
        align: 'left',
        fixed: 'left',
        render(value, record) {
          return (
            <Tooltip title={value} placement="topLeft">
              <Text disabled={record.status !== StatusEnum.ACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Tên đối tác',
        dataIndex: 'orgName',
        width: 200,
        align: 'left',
        fixed: 'left',
        render(value, record) {
          return (
            <Tooltip title={value} placement="topLeft">
              <Text disabled={record.status !== StatusEnum.ACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Người tạo',
        dataIndex: 'createdBy',
        width: 150,
        align: 'left',
        render(value, record) {
          return (
            <Tooltip title={value} placement="topLeft">
              <Text disabled={record.status !== StatusEnum.ACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: 100,
        align: 'left',
        render(value, record) {
          const text = value ? dayjs(value).format(formatDate) : '';
          const tooltip = value ? dayjs(value).format(formatDateTime) : '';
          return (
            <Tooltip title={tooltip} placement="topLeft">
              <Text disabled={record.status !== StatusEnum.ACTIVE}>{text}</Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Người cập nhật',
        dataIndex: 'updatedBy',
        width: 150,
        align: 'left',
        render(value, record) {
          return (
            <Tooltip title={value} placement="topLeft">
              <Text disabled={record.status !== StatusEnum.ACTIVE}>
                {value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedDate',
        width: 150,
        align: 'left',
        render(value, record) {
          const text = value ? dayjs(value).format(formatDate) : '';
          const tooltip = value ? dayjs(value).format(formatDateTime) : '';
          return (
            <Tooltip title={tooltip} placement="topLeft">
              <Text disabled={record.status !== StatusEnum.ACTIVE}>{text}</Text>
            </Tooltip>
          );
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 150,
        align: 'left',
        render(value, record) {
          const text =
            record.status === StatusEnum.ACTIVE
              ? 'Hoạt động'
              : 'Không hoạt động';
          return (
            <Tooltip title={text} placement="topLeft">
              <CTag
                type={
                  value === StatusEnum.ACTIVE
                    ? TypeTagEnum.SUCCESS
                    : TypeTagEnum.ERROR
                }
                bordered={false}
                color={
                  value == StatusEnum.ACTIVE
                    ? ColorList.SUCCESS
                    : ColorList.FAIL
                }
              >
                {text}
              </CTag>
            </Tooltip>
          );
        },
      },
      {
        title: 'Thao tác',
        align: 'center',
        width: 160,
        fixed: 'right',
        render(_, record) {
          const items = [];
          if (permission.canUpdate) {
            items.push({
              key: ActionsTypeEnum.UPDATE,
              onClick: () => {
                onAction(IModeAction.UPDATE, record);
              },
              label: <Text>Chỉnh sửa</Text>,
            });
          }

          // Quản lý user đối tác
          if (
            permission
              .getAllPermissions()
              .includes(IModeAction.PARTNER_USER_MANAGER)
          ) {
            items.push({
              key: ActionsTypeEnum.PARTNER_USER_MANAGER,
              onClick: () => {
                onAction(IModeAction.PARTNER_USER_MANAGER, record);
              },
              label: <Text>Quản lý user đối tác</Text>,
            });
          }
          if (
            permission
              .getAllPermissions()
              .includes(IModeAction.PACKAGE_AUTHORIZATION)
          ) {
            items.push({
              key: ActionsTypeEnum.PACKAGE_AUTHORIZATION,
              onClick: () => {
                onAction(IModeAction.PACKAGE_AUTHORIZATION, record);
              },
              label: <Text>Phân quyền gói cước</Text>,
            });
          }
          return (
            <WrapperActionTable>
              {permission.canRead && (
                <CButtonDetail
                  onClick={() => {
                    onAction(IModeAction.READ, record);
                  }}
                />
              )}
              <Dropdown
                menu={{ items: items }}
                placement="bottom"
                trigger={['click']}
              >
                <MoreVertical size={16} />
              </Dropdown>
            </WrapperActionTable>
          );
        },
      },
    ];
  }, [permission, onAction, params]);
  return columns;
};
