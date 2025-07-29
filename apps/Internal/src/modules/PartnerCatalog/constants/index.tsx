import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, IParamsRequest } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { IOption } from 'apps/Internal/src/components/layouts/types';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { IOrganizationUnitDTO } from '../types';
import { ColorList } from '@react/constants/color';

export enum StatusEnum {
  ACTIVE = '1',
  INACTIVE = '0',
}

export enum ApprovedStatusEnum {
  PENDING = '1',
  APPROVING = '2',
  APPROVED = '3',
  CANCEL = '4',
  REJECT = '5',
}

export const COLOR_APPROVED_STATUS = {
  [ApprovedStatusEnum.PENDING]: ColorList.WAITING,
  [ApprovedStatusEnum.APPROVING]: ColorList.PROCESSING,
  [ApprovedStatusEnum.APPROVED]: ColorList.SUCCESS,
  [ApprovedStatusEnum.CANCEL]: ColorList.FAIL,
  [ApprovedStatusEnum.REJECT]: ColorList.FAIL,
};

export const getColumnsTablePartnerCatalog = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  PARTNER_TYPE: IOption[],
  PARTNER_STATUS: IOption[],
  PARTNER_APPROVAL_STATUS: IOption[],
  onAction: (type: ACTION_MODE_ENUM, record: IOrganizationUnitDTO) => void
): ColumnsType<IOrganizationUnitDTO> => {
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
      title: 'Mã đối tác',
      dataIndex: 'orgCode',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
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
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại đối tác',
      dataIndex: 'orgPartnerType',
      width: 100,
      align: 'left',
      render(value) {
        const text = PARTNER_TYPE
          ? PARTNER_TYPE.find((item) => item.value == value)?.label
          : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
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
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
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
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      width: 150,
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
      title: 'Trạng thái hoạt động',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render(value, record) {
        if (ApprovedStatusEnum.APPROVED != record.approvalStatus) {
          return null;
        }
        const text = PARTNER_STATUS
          ? PARTNER_STATUS.find((item) => item.value == value)?.label
          : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              bordered={false}
              color={value == '1' ? ColorList.SUCCESS : ColorList.CANCEL}
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái Phê duyệt',
      dataIndex: 'approvalStatus',
      width: 150,
      align: 'left',
      render(value) {
        const text = PARTNER_APPROVAL_STATUS
          ? PARTNER_APPROVAL_STATUS.find((item) => item.value == value)?.label
          : '';
        if (!text) {
          return null;
        }
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              bordered={false}
              color={COLOR_APPROVED_STATUS[value as ApprovedStatusEnum]}
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 160,
      fixed: 'right',
      render(_, record) {
        const items = [];
        // Chỉnh sửa
        if (includes(listRoles, ActionsTypeEnum.UPDATE)) {
          items.push({
            key: ACTION_MODE_ENUM.EDIT,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.EDIT, record);
            },
            label: <Text>Chỉnh sửa</Text>,
          });
        }
        // Mở khóa đối tác
        if (
          includes(listRoles, ActionsTypeEnum.UPDATE) &&
          !record.status &&
          record.status == StatusEnum.INACTIVE &&
          record.approvalStatus == ApprovedStatusEnum.APPROVED
        ) {
          items.push({
            key: ACTION_MODE_ENUM.ACTIVE,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.ACTIVE, record);
            },
            label: <Text>Mở khóa đối tác</Text>,
          });
        }
        // Quản lý user đối tác
        if (
          includes(listRoles, ActionsTypeEnum.PARTNER_USER_MANAGER) &&
          record.approvalStatus == ApprovedStatusEnum.APPROVED
        ) {
          items.push({
            key: ActionsTypeEnum.PARTNER_USER_MANAGER,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.PARTNER_USER_MANAGER, record);
            },
            label: <Text>Quản lý user đối tác</Text>,
          });
        }
        // Phân quyền kho số
        // if (
        //   includes(listRoles, ActionsTypeEnum.PHONE_NO_STOCK_AUTHORIZATION) &&
        //   isActiveStatus &&
        //   record.approvalStatus == ApprovedStatusEnum.APPROVED
        // ) {
        //   items.push({
        //     key: ActionsTypeEnum.PHONE_NO_STOCK_AUTHORIZATION,
        //     onClick: () => {
        //       onAction(ACTION_MODE_ENUM.PHONE_NO_STOCK_AUTHORIZATION, record);
        //     },
        //     label: <Text>Phân quyền kho số</Text>,
        //   });
        // }
        // Phân quyền sản phẩm
        if (
          includes(listRoles, ActionsTypeEnum.PRODUCT_AUTHORIZATION) &&
          record.approvalStatus == ApprovedStatusEnum.APPROVED
        ) {
          items.push({
            key: ActionsTypeEnum.PRODUCT_AUTHORIZATION,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.PRODUCT_AUTHORIZATION, record);
            },
            label: <Text>Phân quyền sản phẩm</Text>,
          });
        }
        // tiến độ phê duyệt
        if (includes(listRoles, ActionsTypeEnum.VIEW_APPROVAL_PROCESS)) {
          items.push({
            key: ACTION_MODE_ENUM.VIEW_APPROVAL_PROCESS,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.VIEW_APPROVAL_PROCESS, record);
            },
            label: <Text>Tiến độ phê duyệt</Text>,
          });
        }
        // Khóa đối tác
        if (
          includes(listRoles, ActionsTypeEnum.UPDATE) &&
          record.status == StatusEnum.ACTIVE &&
          record.approvalStatus == ApprovedStatusEnum.APPROVED
        ) {
          items.push({
            key: ACTION_MODE_ENUM.INACTIVE,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.INACTIVE, record);
            },
            label: <Text type="danger">Khóa đối tác</Text>,
          });
        }
        return (
          <WrapperActionTable>
            {includes(listRoles, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() => {
                  onAction(ACTION_MODE_ENUM.VIEW, record);
                }}
              />
            )}
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

export const getColumnsStockPermission = (): ColumnsType<any> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Mã kho',
      dataIndex: 'stockCode',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên kho',
      dataIndex: 'stockName',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
