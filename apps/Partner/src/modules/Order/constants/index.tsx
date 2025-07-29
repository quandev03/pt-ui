import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, IParamsRequest } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { formatCurrencyVND } from '@react/helpers/utils';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Partner/src/assets/images/IconMore.svg';
import { IOption } from 'apps/Partner/src/components/layouts/types';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { IOrder, IProductInOrder } from '../types';

export enum StatusOrderEnum {
  WAITING_FOR_APPROVAL = '1',
  APPROVED = '2',
  SHIPPING = '3',
  DELIVERED = '4',
  CANCELLED = '5',
  REJECTED = '6',
  FINISH = '7',
}

export enum ApprovedStatusEnum {
  PENDING = '1',
  APPROVING = '2',
  APPROVED = '3',
  CANCEL = '4',
  REJECT = '5',
}

export const COLOR_STATUS_ORDER = {
  [StatusOrderEnum.WAITING_FOR_APPROVAL]: ColorList.WAITING,
  [StatusOrderEnum.APPROVED]: ColorList.SUCCESS,
  [StatusOrderEnum.SHIPPING]: ColorList.PROCESSING,
  [StatusOrderEnum.DELIVERED]: ColorList.SUCCESS,
  [StatusOrderEnum.CANCELLED]: ColorList.FAIL,
  [StatusOrderEnum.REJECTED]: ColorList.FAIL,
  [StatusOrderEnum.FINISH]: ColorList.SUCCESS,
};
export const COLOR_APPROVED_STATUS = {
  [ApprovedStatusEnum.PENDING]: ColorList.WAITING,
  [ApprovedStatusEnum.APPROVING]: ColorList.PROCESSING,
  [ApprovedStatusEnum.APPROVED]: ColorList.SUCCESS,
  [ApprovedStatusEnum.CANCEL]: ColorList.FAIL,
  [ApprovedStatusEnum.REJECT]: ColorList.FAIL,
};

export const getColumnsTableOrder = (
  params: IParamsRequest,
  listRoles: ActionsTypeEnum[],
  optionOrderStatus: IOption[],
  optionApprovalStatus: IOption[],
  SALE_ORDER_PAYMENT_OPTION: IOption[],
  onAction: (type: ACTION_MODE_ENUM, record: IOrder) => void,
  onViewESim: (record: IOrder) => void
): ColumnsType<IOrder> => {
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
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
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
      title: 'Tổng tiền trước CK',
      dataIndex: 'totalProductAmount',
      width: 150,
      align: 'right',
      render(value, record) {
        const text = formatCurrencyVND(
          (record.amountDiscount ?? 0) + (record.amountTotal ?? 0)
        );
        return (
          <Tooltip title={text} placement="topRight">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tổng tiền CK',
      dataIndex: 'amountDiscount',
      width: 150,
      align: 'right',
      render(value) {
        const text = formatCurrencyVND(value ?? '');
        return (
          <Tooltip title={text} placement="topRight">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tổng tiền sau CK',
      dataIndex: 'amountTotal',
      width: 150,
      align: 'right',
      render(value) {
        const text = formatCurrencyVND(value ?? '');
        return (
          <Tooltip title={text} placement="topRight">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'PT Thanh toán',
      dataIndex: 'paymentOption',
      width: 150,
      align: 'left',
      render(value) {
        const text =
          SALE_ORDER_PAYMENT_OPTION.find((item) => item.value == value)
            ?.label ?? '';

        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'orderStatus',
      width: 170,
      align: 'left',
      render(value) {
        const color = COLOR_STATUS_ORDER[value as StatusOrderEnum];
        const text =
          optionOrderStatus.find((item) => item.value == value)?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={color}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái phê duyệt',
      dataIndex: 'approvalStatus',
      width: 170,
      align: 'left',
      render(value) {
        const color = COLOR_APPROVED_STATUS[value as ApprovedStatusEnum];
        const text =
          optionApprovalStatus.find((item) => item.value == value)?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={color}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },

    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 200,
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
      title: 'Ngày đặt hàng',
      dataIndex: 'createdDate',
      width: 130,
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
      title: 'Người hủy đơn',
      dataIndex: 'modifiedBy',
      width: 200,
      align: 'left',
      render(value, record) {
        const isShowValue =
          String(record.orderStatus) === StatusOrderEnum.CANCELLED;
        if (!isShowValue) {
          return null;
        }
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày hủy đơn',
      dataIndex: 'modifiedDate',
      width: 130,
      align: 'left',
      render(value, record) {
        const isShowValue =
          String(record.orderStatus) === StatusOrderEnum.CANCELLED;
        if (!isShowValue) {
          return null;
        }
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
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 160,
      fixed: 'right',
      render(_, record) {
        const items = [];
        if (includes(listRoles, ActionsTypeEnum.CREATE)) {
          items.push({
            key: ActionsTypeEnum.COPY,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.Copy, record);
            },
            label: <Text>Sao chép</Text>,
          });
        }
        if (
          includes(listRoles, ActionsTypeEnum.FINISH) &&
          record.orderStatus == StatusOrderEnum.DELIVERED
        ) {
          items.push({
            key: ActionsTypeEnum.FINISH,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.Finish, record);
            },
            label: <Text>Xác nhận hoàn thành</Text>,
          });
        }
        if (
          record.isGenerateEsim &&
          record.orderStatus == StatusOrderEnum.FINISH
        ) {
          items.push({
            key: 'isGenerateEsim',
            onClick: () => {
              onViewESim(record);
            },
            label: <Text>Gen QR eSIM</Text>,
          });
        }
        if (
          includes(listRoles, ActionsTypeEnum.CANCEL) &&
          record.orderStatus == StatusOrderEnum.WAITING_FOR_APPROVAL &&
          record.approvalStatus == ApprovedStatusEnum.PENDING
        ) {
          items.push({
            key: ActionsTypeEnum.CANCEL,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.Cancel, record);
            },
            label: <Text type="danger">Hủy đơn hàng</Text>,
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
            <div className="w-5">
              {(includes(listRoles, ActionsTypeEnum.COPY) ||
                includes(listRoles, ActionsTypeEnum.CANCEL) ||
                includes(listRoles, ActionsTypeEnum.FINISH)) && (
                <Dropdown
                  menu={{ items: items }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <IconMore className="iconMore" />
                </Dropdown>
              )}
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};

export const getColumnsTableProductSelect = (
  params: IParamsRequest
): ColumnsType<IProductInOrder> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 200,
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
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
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
      title: 'Loại sản phẩm',
      dataIndex: 'categoryName',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'productUOM',
      width: 120,
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
      title: 'Đơn giá (VNĐ)',
      dataIndex: 'price',
      width: 120,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
