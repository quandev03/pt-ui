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
import { Dropdown, Flex, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SIM_TYPE, TypeChannel } from '../../OnlineOrders/types';
import { CancelOrderModal } from '../components/CancelOrderModal';
import Header from '../components/Header';
import { RequestRefundModal } from '../components/RequestRefundModal';
import { SendEmailQrSimModal } from '../components/SendEmailQrSimModal';
import {
  getKitStatusOrderCSColor,
  getPaymentStatusOrderCSColor,
  getStatusOrderCSColor,
} from '../contants';
import {
  useCombineKitOrderCs,
  useListOnlineOrdersCsManagement,
} from '../queryHooks';
import useOrderCSStore from '../stores';
import {
  IOnlineOrdersCSManagement,
  IOrderCSStatus,
  IOrderType,
} from '../types';

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

const OrderCS: FC = (props) => {
  const { openRefundModal, openCancelModal, openSendQrESIMModal } =
    useOrderCSStore();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const listRoles = useRolesByRouter();

  const {
    data: dataOrderCS,
    isLoading: loadingTable,
    refetch: refetchList,
  } = useListOnlineOrdersCsManagement(
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
  const { mutate: combineKit } = useCombineKitOrderCs();

  const handleKIT = (record: IOnlineOrdersCSManagement) => {
    ModalConfirm({
      title: 'Thông báo',
      message: 'Bạn có chắc chắn muốn ghép KIT lại cho đơn hàng này không?',
      handleConfirm: () => {
        combineKit(record.id);
      },
    });
  };

  const handleRefetchList = () => {
    refetchList();
  };

  const renderItems = (record: IOnlineOrdersCSManagement) =>
    [
      {
        key: ActionsTypeEnum.CANCEL,
        label: <Text>Hủy</Text>,
        isShow:
          [
            IOrderCSStatus.CREATED,
            IOrderCSStatus.COMBINED_KIT_ERROR,
            IOrderCSStatus.WAITING,
          ].includes(record.deliveryStatus) &&
          record.simType !== SIM_TYPE.ESIM &&
          record.orderType !== IOrderType.DOI_SIM &&
          record.orderType === IOrderType.ONLINE_ORDER &&
          includes(listRoles, ActionsTypeEnum.CANCEL_ORDER), // show khi status là tạo mới hoặc ghép kit lỗi
        onClick: () => {
          openCancelModal(record);
        },
      },
      {
        key: ActionsTypeEnum.CONFIRM,
        label: <Text>Yêu cầu hoàn tiền</Text>,
        isShow:
          [
            IOrderCSStatus.CANCELED_ORDER,
            IOrderCSStatus.RETURNING_ORDER,
            IOrderCSStatus.RETURNED_ORDER,
          ].includes(record.deliveryStatus) &&
          record.orderType !== IOrderType.DOI_SIM &&
          record.orderType === IOrderType.ONLINE_ORDER &&
          includes(listRoles, ActionsTypeEnum.REFUND_REQUEST), // show khi status là Hủy đơn đặt hàng, Đang giao hàng hoàn hoặc Đã giao hàng hoàn
        onClick: () => {
          openRefundModal(record);
        },
      },
      {
        key: ActionsTypeEnum.REJECT,
        label: <Text>Ghép KIT lại</Text>,
        isShow:
          record.deliveryStatus === IOrderCSStatus.COMBINED_KIT_ERROR &&
          record.orderType !== IOrderType.DOI_SIM &&
          record.orderType === IOrderType.ONLINE_ORDER &&
          includes(listRoles, ActionsTypeEnum.RE_CRAFT_KIT), //Chỉ hiển thị button khi trạng thái đơn hàng = Ghép KIT lỗi
        onClick: () => handleKIT(record),
      },
      {
        key: ActionsTypeEnum.SEND_MAIL,
        label: <Text>Gửi email QR eSIM</Text>,
        onClick: () => openSendQrESIMModal(record),
        isShow:
          record.deliveryStatus === IOrderCSStatus.DELIVERED &&
          record.simType === 'eSIM' &&
          record.orderType !== IOrderType.SIM_OUTBOUND &&
          includes(listRoles, ActionsTypeEnum.SEND_MAIL), // chỉ hiển thị với trạng thái đơn hàng = Đã giao hàng, và loại SIM là eSIM
      },
    ].filter((e) => e.isShow);

  const columns: ColumnsType<IOnlineOrdersCSManagement> = [
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
      title: 'Mã vận đơn',
      dataIndex: 'deliveryTransCode',
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
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      width: 160,
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
      title: 'SKUID',
      dataIndex: 'skuid',
      width: 100,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số ngày sử dụng',
      dataIndex: 'usageTime',
      width: 140,
      render(value) {
        const text = value ? `${value} Ngày` : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
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
      title: 'Địa chỉ',
      dataIndex: 'address',
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
      title: 'Phường/Xã',
      dataIndex: 'ward',
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
      title: 'Quận/Huyện',
      dataIndex: 'district',
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
      title: 'Tỉnh/Thành phố',
      dataIndex: 'province',
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
      title: 'Phí vận chuyển',
      dataIndex: 'deliveryFee',
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
      title: 'Trạng thái Đơn hàng',
      dataIndex: 'deliveryStatus',
      width: 160,
      align: 'left',
      render(value, record) {
        const text = record?.deliveryStatusName;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={getStatusOrderCSColor(value)}>
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
            <CTag bordered={false} color={getPaymentStatusOrderCSColor(value)}>
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
      title: 'Trạng thái KIT',
      dataIndex: 'kitStatus',
      width: 140,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <CTag bordered={false} color={getKitStatusOrderCSColor(value)}>
              {value}
            </CTag>
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
      title: 'PT vận chuyển',
      dataIndex: 'deliveryMethodName',
      width: 140,
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
      title: 'Đơn vị vận chuyển',
      dataIndex: 'deliveryPartnerName',
      width: 140,
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
            {items &&
              items.length > 0 &&
              record.channel !== TypeChannel.WebSIMOutbound && (
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
        rowKey={'id'}
        otherHeight={50}
        pagination={{
          total: dataOrderCS?.totalElements || 0,
        }}
      />

      <RequestRefundModal onRefundSuccess={handleRefetchList} />
      <CancelOrderModal onCancelSuccess={handleRefetchList} />
      <SendEmailQrSimModal onSendQrESIMSuccess={handleRefetchList} />
    </Wrapper>
  );
};

export default OrderCS;
