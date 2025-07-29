import { CButtonDetail } from '@react/commons/Button';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ACTION_MODE_ENUM, IParamsRequest } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { formatCurrencyVND } from '@react/helpers/utils';
import { Dropdown, Tooltip } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { IOption } from 'apps/Internal/src/components/layouts/types';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import QuantityInput from '../components/QuatityInput';
import SelectProduct from '../components/SelectProduct';
import { IDataOrder, IProductInOrder } from '../types';

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
  onAction: (type: ACTION_MODE_ENUM, record: IDataOrder) => void,
  onViewProcessApproval: (record: IDataOrder) => void
): ColumnsType<IDataOrder> => {
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
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đối tác',
      dataIndex: 'orgName',
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
        const text = formatCurrencyVND(value ?? 0);
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
      width: 175,
      align: 'left',
      render(value) {
        const color = COLOR_STATUS_ORDER[value as StatusOrderEnum];
        const text = optionOrderStatus
          ? optionOrderStatus.find((item) => item.value == value)?.label ?? ''
          : '';
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
      width: 175,
      align: 'left',
      render: (value) => {
        const color = COLOR_APPROVED_STATUS[value as ApprovedStatusEnum];
        const text = optionApprovalStatus
          ? optionApprovalStatus.find((item) => item.value == value)?.label ??
            ''
          : '';
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
      title: 'Ngày đặt hàng',
      dataIndex: 'createdDate',
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
      title: <FormattedMessage id="common.action" />,
      align: 'center',
      width: 160,
      fixed: 'right',
      render(_, record) {
        const items: ItemType[] = [];
        if (
          record.orderStatus != StatusOrderEnum.WAITING_FOR_APPROVAL &&
          record.orderStatus != StatusOrderEnum.CANCELLED &&
          record.orderStatus != StatusOrderEnum.REJECTED
        ) {
          items.push({
            key: 'ProcessApproval',
            onClick: () => {
              onViewProcessApproval(record);
            },
            label: <Text>Tiến độ phê duyệt</Text>,
          });
        }
        if (
          includes(listRoles, ActionsTypeEnum.APPROVED) &&
          record.orderStatus == StatusOrderEnum.WAITING_FOR_APPROVAL
        ) {
          items.push({
            key: ActionsTypeEnum.APPROVED,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.Approved, record);
            },
            label: <Text>Xác nhận đơn hàng</Text>,
          });
        }
        if (
          includes(listRoles, ActionsTypeEnum.REJECT) &&
          record.orderStatus == StatusOrderEnum.WAITING_FOR_APPROVAL
        ) {
          items.push({
            key: ActionsTypeEnum.REJECT,
            onClick: () => {
              onAction(ACTION_MODE_ENUM.Reject, record);
            },
            label: <Text type="danger">Từ chối đơn hàng</Text>,
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
              {(includes(listRoles, ActionsTypeEnum.APPROVED) ||
                includes(listRoles, ActionsTypeEnum.REJECT)) && (
                <Dropdown
                  menu={{ items }}
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

export const getColumnsTableProduct = (
  onRemove: (index: number) => void,
  actionMode: ACTION_MODE_ENUM
): ColumnsType<IProductInOrder> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(_, __, index) {
        return <SelectProduct index={index} />;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
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
      title: 'Đơn vị',
      dataIndex: 'productUOM',
      width: 100,
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
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 120,
      align: 'left',
      render(value: number, __, index) {
        return <QuantityInput index={index} defaultValue={value} />;
      },
    },
    {
      title: 'Đơn giá',
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
    {
      title: 'Chiết khấu SIM',
      dataIndex: 'simDiscountAmount',
      width: 150,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Chiết khấu gói',
      dataIndex: 'packageDiscountAmount',
      width: 150,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thành tiền trước CK',
      width: 150,
      align: 'right',
      render(_, record) {
        const text =
          Number(record.amountTotal ?? 0) + Number(record.amountDiscount ?? 0);
        return (
          <Tooltip title={formatCurrencyVND(text ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(text ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thành tiền sau CK',
      dataIndex: 'amountTotal',
      width: 150,
      align: 'right',
      render(value) {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            <Text>{formatCurrencyVND(value ?? 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thuế VAT',
      dataIndex: 'vat',
      width: 100,
      align: 'right',
      render(value = 0) {
        return (
          <Tooltip title={value + '%'} placement="topRight">
            <Text>{value}%</Text>
          </Tooltip>
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

export const getColumnsTableProcessApproved = (
  SALE_ORDER_APPROVAL_STATUS: IOption[]
): ColumnsType<IProductInOrder> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approvedUserName',
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
      title: 'Trạng thái duyệt',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value) {
        const text =
          SALE_ORDER_APPROVAL_STATUS.find((item) => item.value == value)
            ?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render(value) {
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        const text = value ? dayjs(value).format(formatDate) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'createdDate',
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
  ];
};
