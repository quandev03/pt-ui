import { CButtonDetail } from '@react/commons/Button';
import { CModalConfirm, CTable, CTag, CTooltip } from '@react/commons/index';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import {
  DeliveryOrderApprovalStatusList,
  DeliveryOrderStatusList,
} from '@react/constants/status';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate, toLocalISOString } from '@react/utils/datetime';
import { MESSAGE } from '@react/utils/message';
import {
  getDeliveryOrderStatusColor,
  getLastStatusColor,
} from '@react/utils/status';
import { Dropdown, MenuProps, Space, TableColumnsType } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useEditStatusOrder } from '../hooks/useEditStatusOrder';
import { useListMerchantOrder } from '../hooks/useListOrder';
import { MerchantOrderType } from '../types';
import { useViewProcess } from '../../Approval/hooks/useViewProcess';
import ModalProcess from '../../Approval/components/ModalProcess';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import dayjs from 'dayjs';

const MerchantOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    fromDate: dayjs().subtract(29, 'd').startOf('d').format(),
    toDate: dayjs().endOf('d').format(),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const actions = useRolesByRouter();
  const allParams = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const [isOpenProcess, setIsOpenProcess] = useState<boolean>(false);
  const { data, isFetching: isLoadingList } = useListMerchantOrder(
    queryParams(params)
  );
  const { mutate: mutateViewProcess, data: dataProcess } = useViewProcess();
  const { mutate: mutateStatus, isPending: isLoadingStatus } =
    useEditStatusOrder();

  const handleView = (id: string) => {
    navigate(pathRoutes.merchantOrderView(id));
  };
  const handleCopy = (id: string) => {
    navigate(pathRoutes.merchantOrderCopy(id));
  };
  const handleProcess = (id: string) => {
    setIsOpenProcess(true);
    mutateViewProcess({ recordId: id, objectName: 'DELIVERY_ORDER' });
  };
  const handleCancelOrder = (id: string) => {
    CModalConfirm({
      message: MESSAGE.G15,
      onOk: () => {
        mutateStatus({ id, status: DeliveryOrderStatusList.CANCEL });
      },
    });
  };
  const renderMenuItemsMore = (
    id: string,
    record: MerchantOrderType
  ): MenuProps['items'] => {
    return [
      {
        key: 1,
        label: <Text>Sao chép</Text>,
        onClick: () => handleCopy(id),
      },
      {
        key: 2,
        label: <Text type="danger">Hủy đơn hàng</Text>,
        onClick: () => handleCancelOrder(id),
        hidden:
          record.approvalStatus !== DeliveryOrderApprovalStatusList.PENDING ||
          record.orderStatus === DeliveryOrderStatusList.CANCEL,
      },
      {
        key: 3,
        label: <Text>Tiến độ phê duyệt</Text>,
        onClick: () => handleProcess(id),
      },
    ].filter((e) => !e.hidden);
  };

  const columns: TableColumnsType<MerchantOrderType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      render: (_, __, idx: number) => {
        return <div>{page * size + idx + 1}</div>;
      },
    },
    {
      title: 'Mã đơn hàng (PO)',
      dataIndex: 'orderNo',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      width: 120,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DEFAULT)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: <span title="Trạng thái phê duyệt">TT phê duyệt</span>,
      dataIndex: 'approvalStatus',
      width: 120,
      render: (value: number) => {
        const statusName = allParams?.DELIVERY_ORDER_APPROVAL_STATUS?.find(
          (e) => +e.value === value
        )?.label;
        return (
          <CTooltip title={statusName}>
            <CTag color={getLastStatusColor(value)}>{statusName}</CTag>
          </CTooltip>
        );
      },
    },
    {
      title: <span title="Trạng thái đơn">TT đơn</span>,
      dataIndex: 'orderStatus',
      width: 110,
      render: (value: number) => {
        const statusName = allParams?.DELIVERY_ORDER_ORDER_STATUS?.find(
          (e) => +e.value === value
        )?.label;
        return (
          <CTooltip title={statusName}>
            <CTag color={getDeliveryOrderStatusColor(value)}>{statusName}</CTag>
          </CTooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (value, record) => (
        <WrapperActionTable>
          {includes(actions, ActionsTypeEnum.READ) && (
            <CButtonDetail type="default" onClick={() => handleView(value)} />
          )}
          {1 && (
            <Dropdown
              menu={{ items: renderMenuItemsMore(value, record) }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="cursor-pointer" />
            </Dropdown>
          )}
        </WrapperActionTable>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        rowKey={'id'}
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        loading={isLoadingList || isLoadingStatus}
      />
      <ModalProcess
        data={dataProcess}
        isOpen={isOpenProcess}
        setIsOpen={setIsOpenProcess}
      />
    </>
  );
};

export default MerchantOrderPage;
