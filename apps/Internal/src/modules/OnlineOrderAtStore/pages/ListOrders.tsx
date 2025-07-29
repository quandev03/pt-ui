import { CTable, CTag } from '@react/commons/index';
import { Text, Wrapper } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import {
  formatDate,
  formatDateEnglishV2,
  formatDateTime,
} from '@react/constants/moment';
import {
  decodeSearchParams,
  formatCurrencyVND,
  queryParams,
} from '@react/helpers/utils';
import { Dropdown, Flex, Row, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CancelOrderModal } from '../components/CancelOrderModal';
import Header from '../components/Header';
import { RequestRefundModal } from '../components/RequestRefundModal';
import {
  getPaymentStatusOrderOnlineColor,
  getStatusOrderOnlineColor,
} from '../contants';
import {
  useCombineKitOrderAtStore,
  useConfirmReceipt,
  useListOnlineOrdersAtStoreManagement,
} from '../queryHooks';
import useOrderCSStore from '../stores';
import {
  IOnlineOrderAtStoreManagement,
  IOrderOnlineStatus,
  ORDER_TYPE_ENUM,
} from '../types';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';

export enum StatusOrderEnum {
  WAITING_FOR_APPROVAL = '1',
  APPROVED = '2',
  SHIPPING = '3',
  DELIVERED = '4',
  CANCELLED = '5',
  REJECTED = '6',
  FINISH = '7',
}

export const COLOR_STATUS_ORDER = {
  [StatusOrderEnum.WAITING_FOR_APPROVAL]: 'processing',
  [StatusOrderEnum.APPROVED]: 'success',
  [StatusOrderEnum.SHIPPING]: 'purple',
  [StatusOrderEnum.DELIVERED]: 'orange',
  [StatusOrderEnum.CANCELLED]: 'magenta',
  [StatusOrderEnum.REJECTED]: 'red',
  [StatusOrderEnum.FINISH]: 'green',
};

const OrderAtStore: FC = (props) => {
  const navigate = useNavigate();
  const listRoles = useRolesByRouter();
  const { openRefundModal, openCancelModal } = useOrderCSStore();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: dataOrderCS, isLoading: loadingTable } =
    useListOnlineOrdersAtStoreManagement(
      queryParams({
        ...params,
        fromDate: params.fromDate
          ? dayjs(params.fromDate).format(formatDateEnglishV2)
          : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
        toDate: params.toDate
          ? dayjs(params.toDate).format(formatDateEnglishV2)
          : dayjs().format(formatDateEnglishV2),
      })
    );
  const { mutate: combineKit } = useCombineKitOrderAtStore();
  const { mutate: confirmReceipt } = useConfirmReceipt();

  const handleKIT = (record: IOnlineOrderAtStoreManagement) => {
    ModalConfirm({
      message: `Bạn có chắc chắn muốn ghép KIT lại cho đơn hàng này không?`,
      title: 'Xác nhận',
      handleConfirm: () => {
        combineKit(record.id);
      },
    });
  };

  const handleConfirmReceipt = (record: IOnlineOrderAtStoreManagement) => {
    ModalConfirm({
      message: `Bạn có chắc chắn muốn xác nhận đã giao hàng cho đơn hàng ${record.orderNo} không?`,
      title: 'Xác nhận',
      handleConfirm: () => {
        confirmReceipt(record.id);
      },
    });
  };

  const handleActiveSim = (record: IOnlineOrderAtStoreManagement) => {
    navigate(
      `${pathRoutes.activateSubscription}?phone=${record.isdn}&serialSim=${record.serial}`
    );
  };
  console.log('🚀 ~ listRoles:', listRoles);
  const renderItems = (record: IOnlineOrderAtStoreManagement) =>
    [
      {
        key: ActionsTypeEnum.CANCEL,
        label: <Text>Hủy</Text>,
        isShow:
          [
            IOrderOnlineStatus.CREATED,
            IOrderOnlineStatus.COMBINED_KIT_ERROR,
          ].includes(record.deliveryStatus) &&
          record.orderType !== ORDER_TYPE_ENUM.CHANGE_SIM &&
          includes(listRoles, ActionsTypeEnum.CANCEL_ORDER), // show khi status là tạo mới hoặc ghép kit lỗi
        onClick: () => {
          openCancelModal(record);
        },
      },
      {
        key: ActionsTypeEnum.REFUND,
        label: <Text>Yêu cầu hoàn tiền</Text>,
        isShow:
          record.deliveryStatus === IOrderOnlineStatus.CANCELED_ORDER &&
          includes(listRoles, ActionsTypeEnum.REFUND_REQUEST), // show khi status là Hủy đơn đặt hàng
        onClick: () => {
          openRefundModal(record);
        },
      },
      {
        key: ActionsTypeEnum.UPDATE,
        label: <Text>Ghép KIT lại</Text>,
        isShow:
          record.deliveryStatus === IOrderOnlineStatus.COMBINED_KIT_ERROR &&
          includes(listRoles, ActionsTypeEnum.RE_CRAFT_KIT), //Chỉ hiển thị button khi trạng thái đơn hàng = Ghép KIT lỗi
        onClick: () => handleKIT(record),
      },
      {
        key: ActionsTypeEnum.CONFIRM,
        label: <Text>Xác nhận giao hàng</Text>,
        isShow:
          record.deliveryStatus === IOrderOnlineStatus.CREATED &&
          includes(listRoles, ActionsTypeEnum.CONFIRM), //Chỉ hiển thị button khi trạng thái đơn hàng = tạo mới
        onClick: () => handleConfirmReceipt(record),
      },
      {
        key: ActionsTypeEnum.ACCEPT,
        label: <Text>Kích hoạt</Text>,
        isShow:
          record.deliveryStatus === IOrderOnlineStatus.DELIVERED &&
          record.orderType === ORDER_TYPE_ENUM.ONLINE_ORDER &&
          includes(listRoles, ActionsTypeEnum.ACTIVATE_SUBSCRIBER), //Chỉ hiển thị button khi trạng thái đơn hàng = Đã giao hàng và PTVC của đơn hàng là Lấy tại cửa hàng
        onClick: () => handleActiveSim(record),
      },
    ].filter((e) => e.isShow);

  const columns: ColumnsType<IOnlineOrderAtStoreManagement> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(value, record, index) {
        return (
          <Text>{index + 1 + (params.page || 0) * (params.size || 20)}</Text>
        );
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
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
      title: 'Số điện thoại',
      dataIndex: 'isdn',
      width: 120,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Serial SIM',
      dataIndex: 'serial',
      width: 180,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại SIM',
      dataIndex: 'simType',
      width: 150,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'store',
      width: 140,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'packageName',
      width: 140,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên KH',
      dataIndex: 'customerName',
      width: 150,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số liên hệ',
      dataIndex: 'customerPhone',
      width: 120,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      width: 140,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian đặt hàng',
      dataIndex: 'orderTime',
      width: 140,
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
      title: 'Giá tiền sản phẩm',
      dataIndex: 'productAmount',
      width: 160,
      align: 'right',
      render(value) {
        return (
          <Tooltip
            title={formatCurrencyVND(value ? value : 0)}
            placement="topRight"
          >
            <Text>{formatCurrencyVND(value ? value : 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tổng giá trị đơn hàng',
      dataIndex: 'amountTotal',
      width: 160,
      align: 'right',
      render(value) {
        return (
          <Tooltip
            title={formatCurrencyVND(value ? value : 0)}
            placement="topRight"
          >
            <Text>{formatCurrencyVND(value ? value : 0)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'deliveryStatus',
      width: 160,
      align: 'left',
      render(value, record) {
        const text = record?.deliveryStatusName;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={getStatusOrderOnlineColor(value)}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'payStatus',
      width: 160,
      render(value, record) {
        const text = record?.payStatusName;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              bordered={false}
              color={getPaymentStatusOrderOnlineColor(value)}
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'User ghép KIT',
      dataIndex: 'combinedKitUser',
      width: 180,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian ghép KIT',
      dataIndex: 'combinedKitTime',
      width: 160,
      render(value) {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : ''}
            placement="topLeft"
          >
            <Text>{value ? dayjs(value).format(formatDateTime) : ''}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kênh bán',
      dataIndex: 'channel',
      width: 110,
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
      title: 'Ghi chú',
      dataIndex: 'note',
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
      title: 'Người hủy đơn',
      dataIndex: 'cancelUser',
      width: 180,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian hủy đơn',
      dataIndex: 'cancelTime',
      width: 160,
      render(value) {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : ''}
            placement="topLeft"
          >
            <Text>{value ? dayjs(value).format(formatDateTime) : ''}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Lý do hủy',
      dataIndex: 'cancelReason',
      width: 140,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      width: 120,
      fixed: 'right',
      render(_, record) {
        const items = renderItems(record);
        return (
          <Flex align="center">
            {items && items.length > 0 && (
              <Dropdown
                menu={{ items: items }}
                placement="bottom"
                trigger={['click']}
              >
                <IconMore className="cursor-pointer" />
              </Dropdown>
            )}
          </Flex>
        );
      },
    },
  ];

  return (
    <Wrapper id="wrapperFeedbackManager">
      <Header />
      <CTable
        columns={columns}
        dataSource={dataOrderCS?.content ?? []}
        loading={loadingTable}
        otherHeight={50}
        rowKey={'id'}
        pagination={{
          total: dataOrderCS?.totalElements || 0,
        }}
      />
      <RequestRefundModal />
      <CancelOrderModal />
    </Wrapper>
  );
};

export default OrderAtStore;
