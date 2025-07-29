import { CButtonDetail } from '@react/commons/Button';
import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import { Text } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
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
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getStatusOrderOnlineColor } from '../contant';
import {
  useCreateOnlineOrder,
  useListOnlineOrdersManagement,
} from '../queryHook/useList';
import {
  IDetailOnlineOrder,
  IOnlineOrdersManagement,
  IOrderOnlinetatus,
  ISelectDVVC,
  SIM_TYPE,
  TypeChannel,
} from '../types';
import Header from './Header';
import ModalSelectUnitAgain from './ModalSelectUnitAgain';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useStore from '../store';
import { SendEmailQrSimModal } from './SendEmailQrSimModal';
import { useReCreateOrderWebsim } from '../queryHook/useReCreateOrderWebsim';
import { NotificationSuccess } from '@react/commons/Notification';

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

const Body: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const listRoles = useRolesByRouter();
  const { openSendQrESIMModal } = useStore();
  const { SALE_ORDER_DELIVERY_METHOD = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const storeDeliveryMethod = useMemo(() => {
    const result = SALE_ORDER_DELIVERY_METHOD.find(
      (item) => item.value === 'STORE'
    )?.label;
    return result ?? 'Nhận tại cửa hàng';
  }, [SALE_ORDER_DELIVERY_METHOD]);

  const [openSelectDVVC, setOpenSelectDVVC] = useState<ISelectDVVC>({
    isOpen: false,
  });
  const {
    data: dataOrder,
    isLoading: loadingTable,
    refetch: refetchList,
  } = useListOnlineOrdersManagement(
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
  const { mutateAsync: onCreateOrder, isPending: loadingCreateOrder } =
    useCreateOnlineOrder();
  const { mutateAsync: muateCreateOrder } =
    useReCreateOrderWebsim();
  const openModalEditView = (
    type: ActionType,
    record: IOnlineOrdersManagement
  ) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.onlineOrdersEdit(record.id)
        : pathRoutes.onlineOrdersView(record.id)
    );
  };

  const handleSelectDVVC = (record: IOnlineOrdersManagement) => {
    setOpenSelectDVVC({
      isOpen: true,
      data: record,
    });
  };

  const handleConfirmDVVC = () => {
    setOpenSelectDVVC({
      isOpen: false,
      data: undefined,
    });
  };

  const handleCancelDVVC = () => {
    setOpenSelectDVVC({
      isOpen: false,
      data: undefined,
    });
  };
  const handleCreateOrder = (orderId: string) => {
    ModalConfirm({
      message: 'Bạn chắc chắn muốn tạo đơn giao hàng?',
      handleConfirm: () => {
        onCreateOrder(orderId);
      },
    });
  };
  const handlReCreateOrderWebsim = useCallback((id: string) => {
    muateCreateOrder(id)
  }, [muateCreateOrder])
  const renderItems = (record: IOnlineOrdersManagement) =>
    [
      {
        key: ActionsTypeEnum.CREATE_DELIVER_ORDER,
        label: <Text>Tạo đơn giao hàng</Text>,
        isShow:
          record.deliveryStatus === IOrderOnlinetatus.CREATED &&
          includes(listRoles, ActionsTypeEnum.CREATE_ORDER_DELIVERY) &&
          record.deliveryMethodName !== storeDeliveryMethod, // status thêm mới thì cho tạo đơn hàng
        onClick: () => {
          record.id && handleCreateOrder(String(record.id));
        },
      },
      {
        key: ActionsTypeEnum.UPDATE,
        label: <Text>Chỉnh sửa</Text>,
        isShow:
          (
            (record.channel === TypeChannel.WebSIMOutbound &&
              record.deliveryStatus === IOrderOnlinetatus.NEW_CREATION_FAILED) ||
            (record.channel !== TypeChannel.WebSIMOutbound &&
              [
                IOrderOnlinetatus.CREATED,
                IOrderOnlinetatus.COMBINED_KIT_ERROR,
              ].includes(record.deliveryStatus))
          ) &&
          record.simType !== SIM_TYPE.ESIM &&
          includes(listRoles, ActionsTypeEnum.UPDATE) &&
          record.deliveryMethodName !== storeDeliveryMethod,
        onClick: () => {
          openModalEditView(ActionType.EDIT, record);
        },
      },
      {
        key: ActionsTypeEnum.RESELVE_SHIPPING_UNIT,
        label: <Text>Chọn lại đơn vị vận chuyển</Text>,
        isShow:
          record.deliveryStatus === IOrderOnlinetatus.CREATED &&
          includes(listRoles, ActionsTypeEnum.CREATE_DELIVERY) &&
          record.deliveryMethodName !== storeDeliveryMethod, // status thêm mới thì Chọn lại đơn vị vận chuyển
        onClick: () => {
          handleSelectDVVC(record);
        },
      },
      {
        key: ActionsTypeEnum.RECREATE_ORDER,
        label: <Text>Tạo lại đơn</Text>,
        isShow:
          record.channel === TypeChannel.WebSIMOutbound && record.deliveryStatus === IOrderOnlinetatus.NEW_CREATION_FAILED &&
          // includes(listRoles, ActionsTypeEnum.RECREATE_ORDER) &&
          record.deliveryMethodName !== storeDeliveryMethod,
        onClick: () => {
          handlReCreateOrderWebsim(String(record.id));
        },
      },
      {
        key: ActionsTypeEnum.SEND_MAIL,
        label: <Text>Gửi email QR eSIM</Text>,
        onClick: () =>
          openSendQrESIMModal(record as unknown as IDetailOnlineOrder),
        isShow:
          record.channel === TypeChannel.WebSIMOutbound &&
          record.deliveryStatus === IOrderOnlinetatus.DELIVERED &&
          record.esimCount > 0,
      },
    ].filter((e) => e.isShow);

  const columns: ColumnsType<IOnlineOrdersManagement> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(value, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
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
      title: 'Mã vận đơn',
      dataIndex: 'deliveryTransCode',
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
      title: 'Kênh bán',
      dataIndex: 'channel',
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
      title: 'Số lượng',
      dataIndex: 'quantity',
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
      title: 'Tổng tiền',
      dataIndex: 'amountTotal',
      width: 140,
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
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethodName',
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
      title: 'Phương thức vận chuyển',
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
      title: 'Phí vận chuyển',
      dataIndex: 'deliveryFee',
      width: 140,
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
      title: 'Trạng thái Đơn hàng',
      dataIndex: 'deliveryStatus',
      width: 160,
      align: 'left',
      render(value, record) {
        const text =
          value === IOrderOnlinetatus.NEW_CREATION_FAILED
            ? 'Tạo mới thất bại'
            : record?.deliveryStatusName;
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
      title: 'Thời gian hủy đơn',
      dataIndex: 'cancelTime',
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
      title: 'Người hủy đơn',
      dataIndex: 'cancelUser',
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
      title: 'Ghi chú',
      dataIndex: 'note',
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
      title: 'Lý do hủy',
      dataIndex: 'cancelReason',
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
      title: 'Mã đơn hàng đối tác',
      dataIndex: 'partnerOrderNo',
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
      title: 'Thao tác',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = renderItems(record);
        return (
          <Flex align="center">
            <CButtonDetail
              onClick={() => openModalEditView(ActionType.VIEW, record)}
            />
            <div className="w-5">
              {items && items.length > 0 && (
                <Dropdown
                  menu={{ items: items }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <IconMore className="iconMore cursor-pointer" />
                </Dropdown>
              )}
            </div>
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <CTable
        loading={loadingTable || loadingCreateOrder}
        columns={columns}
        dataSource={dataOrder?.content ?? []}
        rowKey={'id'}
        otherHeight={50}
        pagination={{
          total: dataOrder?.totalElements,
        }}
      />
      <ModalSelectUnitAgain
        data={openSelectDVVC}
        onCancel={handleCancelDVVC}
        onConfirm={handleConfirmDVVC}
      />
      <SendEmailQrSimModal onSendQrESIMSuccess={refetchList} />
    </>
  );
};

export default Body;
