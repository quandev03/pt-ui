import { CButtonClose, CButtonDetail } from '@react/commons/Button';
import { Dropdown, MenuProps, Row, Space, TableProps, Tooltip } from 'antd';
import { Text, Wrapper } from '@react/commons/Template/style';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { ModelStatus } from '@react/commons/types';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { CTable, CTag } from '@react/commons/index';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useState } from 'react';
import { getDate } from '@react/utils/datetime';
import { ColorList } from '@react/constants/color';
import dayjs from 'dayjs';
import useSubscriberStore from '../store';
import { Subscriber } from '../types';
import Header from '../components/Header';
import { useSubscriberQuery } from '../hooks/useSubscriberQuery';
import { ImpactStatus } from 'apps/Internal/src/modules/SearchSubscription/types';
import SubscriberModal from '../components/SubscriberModal';
import CancelSubscriberModal from '../components/CancelSubscriberModal';

const SubscriberPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actions = useRolesByRouter();
  const [isOpenSubscriber, setIsOpenSubscriber] = useState(false);
  const [isOpenCancelSubscriber, setIsOpenCancelSubscriber] = useState(false);
  const { subIds, setSubId, setSubIds } = useSubscriberStore();

  const { isFetching, data } = useSubscriberQuery(
    queryParams({
      ...params,
      enterpriseId: id,
      dateType: 1,
      fromDate:
        params.fromDate ?? dayjs().subtract(6, 'M').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );
  const { data: activeStatusData } = useParameterQuery({
    'table-name': 'SUBSCRIBER',
    'column-name': 'ACTIVE_STATUS',
  });

  const renderMenuItemsMore = (
    id: string,
    status: ModelStatus,
    actionAllow: ImpactStatus
  ): MenuProps['items'] => {
    const disabled =
      status === ModelStatus.INACTIVE || actionAllow !== ImpactStatus.OPEN;
    return [
      {
        key: ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER'],
        label: <Text disabled={disabled}>Chặn/Mở thuê bao</Text>,
        disabled: disabled,
        onClick: () => {
          setIsOpenSubscriber(true);
          setSubId(id);
        },
      },
      {
        key: ActionsTypeEnum.CANCEL_SUBSCRIPTION,
        label: <Text disabled={disabled}>Hủy thuê bao</Text>,
        disabled: disabled,
        onClick: () => {
          setIsOpenCancelSubscriber(true);
          setSubId(id);
        },
      },
    ].filter((item) => actions.includes(item.key));
  };

  const rowSelection = {
    selectedRowKeys: subIds,
    preserveSelectedRowKeys: true,
    onChange: (keys: React.Key[]) => setSubIds(keys),
  };

  const columns: TableProps<Subscriber>['columns'] = [
    {
      title: 'STT',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => params.page * params.size + index + 1,
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Loại thuê bao',
      dataIndex: 'subType',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Người/ Thiết bị SD',
      dataIndex: 'name',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày kích hoạt',
      dataIndex: 'activeDate',
      width: 160,
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
      title: 'Gói cước',
      dataIndex: 'packageName',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày hết hạn gói cước',
      dataIndex: 'packageExpirationDate',
      width: 170,
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
      title: 'Trạng thái thuê bao',
      dataIndex: 'status',
      width: 160,
      render: (value) => (
        <Tooltip
          title={value ? 'Đang hoạt động' : 'Đã hủy'}
          placement="topLeft"
        >
          <CTag
            color={
              value === ModelStatus.ACTIVE
                ? ColorList.SUCCESS
                : ColorList.DEFAULT
            }
          >
            {value ? 'Đang hoạt động' : 'Đã hủy'}
          </CTag>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái chặn cắt',
      dataIndex: 'activeStatus',
      width: 160,
      render: (value) => (
        <Tooltip
          title={
            activeStatusData?.find((item) => Number(item.value) === value)
              ?.label
          }
          placement="topLeft"
        >
          {
            activeStatusData?.find((item) => Number(item.value) === value)
              ?.label
          }
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 140,
      hidden: !actions?.some((item) =>
        [
          ActionsTypeEnum.READ,
          ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER'],
          ActionsTypeEnum.CANCEL_SUBSCRIPTION,
        ].includes(item)
      ),
      render: ({ id: subId, status, actionAllow }) => (
        <Space size="middle">
          {actions.includes(ActionsTypeEnum.READ) && (
            <Link
              to={pathRoutes.subscriberEnterpriseView(id)}
              state={{ subId }}
            >
              <CButtonDetail />
            </Link>
          )}
          {actions.filter((item) =>
            [
              ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER'],
              ActionsTypeEnum.CANCEL_SUBSCRIPTION,
            ].includes(item)
          ).length > 0 && (
            <Dropdown
              menu={{ items: renderMenuItemsMore(subId, status, actionAllow) }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="cursor-pointer" />
            </Dropdown>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Wrapper>
      <Header />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content}
        loading={isFetching}
        otherHeight={60}
        rowSelection={rowSelection}
        rowClassName={(record) =>
          record.status === ModelStatus.INACTIVE ? 'text-disabled' : ''
        }
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
        }}
      />
      <Row justify="end" className={data?.totalElements ? '' : 'mt-5'}>
        <CButtonClose onClick={() => navigate(pathRoutes.businessManagement)} />
      </Row>
      <SubscriberModal
        isOpen={isOpenSubscriber}
        setIsOpen={setIsOpenSubscriber}
      />
      <CancelSubscriberModal
        isOpen={isOpenCancelSubscriber}
        setIsOpen={setIsOpenCancelSubscriber}
      />
    </Wrapper>
  );
};

export default SubscriberPage;
