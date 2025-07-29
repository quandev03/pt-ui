import { CButtonDetail } from '@react/commons/Button';
import { Dropdown, MenuProps, Space, TableProps, Tooltip } from 'antd';
import Header from '../components/Header';
import {
  Text,
  Wrapper,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ModelStatus } from '@react/commons/types';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { CTable, CTag } from '@react/commons/index';
import { useSubscriptionQuery } from '../hooks/useSubscriptionQuery';
import { ImpactStatus, PromotionStatus, Subscription } from '../types';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useEffect, useState } from 'react';
import { useIsAdmin } from '../hooks/useIsAdmin';
import ZoneModal from '../components/ZoneModal';
import PackageModal from '../components/PackageModal';
import ServiceModal from '../components/ServiceModal';
import PromotionModal from '../components/PromotionModal';
import SubscriberModal from '../components/SubscriberModal';
import useSubscriptionStore from '../store';
import { getDate } from '@react/utils/datetime';
import CancelSubscriberModal from '../components/CancelSubscriberModal';
import { ColorList } from '@react/constants/color';
import { BinaryStatusColor } from '../../VerificationList/types';

const SearchSubscriptionPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actions = useRolesByRouter();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [isOpenZone, setIsOpenZone] = useState(false);
  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const [isOpenService, setIsOpenService] = useState(false);
  const [isOpenPromotion, setIsOpenPromotion] = useState(false);
  const [isOpenSubscriber, setIsOpenSubscriber] = useState(false);
  const [isOpenCancelSubscriber, setIsOpenCancelSubscriber] = useState(false);
  const { setSubscriberId } = useSubscriptionStore();

  const { isFetching, data, isSuccess } = useSubscriptionQuery(
    queryParams({ ...params, isAdmin })
  );
  const { data: approvalStatusData } = useParameterQuery({
    'table-name': 'SUB_DOCUMENT',
    'column-name': 'APPROVAL_STATUS',
  });
  const { data: activeStatusData } = useParameterQuery({
    'table-name': 'SUBSCRIBER',
    'column-name': 'ACTIVE_STATUS',
  });

  useEffect(() => {
    if (data?.content?.length === 1 && params.isSearch && isSuccess) {
      delete params.isSearch;
      setSearchParams(params);
      const id = `${data.content[0].id}`;
      const status = data.content[0].status;

      if (isAdmin) {
        navigate(pathRoutes.searchSubscriptionView(id));
      } else if (status === ModelStatus.ACTIVE) {
        navigate(pathRoutes.searchSubscriptionStaffView(id));
      }
    }
  }, [data?.content, params.isSearch, isAdmin]);

  const renderMenuItemsMore = (
    id: string,
    status: ModelStatus,
    actionAllow: ImpactStatus,
    registerPromStatus: PromotionStatus
  ): MenuProps['items'] => {
    const disabled =
      status === ModelStatus.INACTIVE || actionAllow !== ImpactStatus.OPEN;
    return [
      {
        key: ActionsTypeEnum.CHANGE_ZONE,
        label: <Text disabled={disabled}>Đổi Zone</Text>,
        disabled: disabled,
        onClick: () => {
          setIsOpenZone(true);
          setSubscriberId(id);
        },
      },
      {
        key: ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE_PACKAGE,
        label: <Text disabled={disabled}>Đăng ký/Hủy gói cước</Text>,
        disabled: disabled,
        onClick: () => {
          setIsOpenPackage(true);
          setSubscriberId(id);
        },
      },
      {
        key: ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE,
        label: <Text disabled={disabled}>Đăng ký/Hủy dịch vụ</Text>,
        disabled: disabled,
        onClick: () => setIsOpenService(true),
      },
      {
        key: ActionsTypeEnum.CANCEL_CTKM,
        label: (
          <Text disabled={disabled}>
            {registerPromStatus === PromotionStatus.REGISTER
              ? 'Hủy CTKM'
              : 'Đăng ký lại CTKM'}
          </Text>
        ),
        disabled: disabled,
        onClick: () => {
          setIsOpenPromotion(true);
          setSubscriberId(id);
        },
      },
      {
        key: ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER'],
        label: <Text disabled={disabled}>Chặn/Mở thuê bao</Text>,
        disabled: disabled,
        onClick: () => {
          setIsOpenSubscriber(true);
          setSubscriberId(id);
        },
      },
      {
        key: ActionsTypeEnum.CANCEL_SUBSCRIPTION,
        label: <Text disabled={disabled}>Hủy thuê bao</Text>,
        disabled: disabled,
        onClick: () => {
          setIsOpenCancelSubscriber(true);
          setSubscriberId(id);
        },
      },
    ].filter((item) => actions.includes(item.key));
  };

  const columns: TableProps<Subscription>['columns'] = [
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
    },
    {
      title: 'Serial SIM',
      dataIndex: 'serial',
      width: 170,
    },
    {
      title: 'Số GTTT',
      dataIndex: 'idNo',
      width: 130,
      hidden: !isAdmin,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      width: 180,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày kích hoạt',
      dataIndex: 'activeDate',
      width: 170,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'User kích hoạt',
      dataIndex: 'activeUser',
      width: 180,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái thuê bao',
      dataIndex: 'status',
      width: 170,
      render: (value) => (
        <CTag
          color={
            value === ModelStatus.ACTIVE ? ColorList.SUCCESS : ColorList.DEFAULT
          }
        >
          {value ? 'Đang hoạt động' : 'Đã hủy'}
        </CTag>
      ),
    },
    {
      title: 'Trạng thái kiểm duyệt',
      dataIndex: 'statusApproval',
      width: 180,
      render: (value) =>
        approvalStatusData?.find((item) => Number(item.value) === value)?.label,
    },

    {
      title: 'Trạng thái cập nhật giấy tờ',
      dataIndex: 'statusUpdateDoc',
      align: 'left',
      width: 200,

      render(value) {
        let renderedValue = null;
        if (value === 0) {
          renderedValue = 'Chưa cập nhật';
        } else if (value === 1) {
          renderedValue = 'Đã cập nhật';
        }
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <CTag
              color={BinaryStatusColor[value as keyof typeof BinaryStatusColor]}
            >
              {renderedValue}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái chặn cắt',
      dataIndex: 'activeStatus',
      width: 160,
      render: (value) =>
        activeStatusData?.find((item) => Number(item.value) === value)?.label,
    },
    {
      title: 'Ngày thu hồi',
      dataIndex: 'revokeDate',
      width: 120,
      render: (value) => getDate(value),
    },
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'enterprise',
      width: 180,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
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
          ActionsTypeEnum.CHANGE_ZONE,
          ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE_PACKAGE,
          ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE,
          ActionsTypeEnum.CANCEL_CTKM,
          ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER'],
          ActionsTypeEnum.CANCEL_SUBSCRIPTION,
        ].includes(item)
      ),
      render: ({ id, status, actionAllow, registerPromStatus }) => (
        <WrapperActionTable>
          {actions.includes(ActionsTypeEnum.READ) && (
            <Link
              to={
                isAdmin
                  ? pathRoutes.searchSubscriptionView(id)
                  : pathRoutes.searchSubscriptionStaffView(id)
              }
            >
              <CButtonDetail
                disabled={!isAdmin && status === ModelStatus.INACTIVE}
              />
            </Link>
          )}
          {actions.filter((item) =>
            [
              ActionsTypeEnum.CHANGE_ZONE,
              ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE_PACKAGE,
              ActionsTypeEnum.SUBCRIBE_UNSUBCRIBE,
              ActionsTypeEnum.CANCEL_CTKM,
              ActionsTypeEnum['BLOCK/UNBLOCK_SUBCRIBER'],
              ActionsTypeEnum.CANCEL_SUBSCRIPTION,
            ].includes(item)
          ).length > 0 && (
            <Dropdown
              menu={{
                items: renderMenuItemsMore(
                  id,
                  status,
                  actionAllow,
                  registerPromStatus
                ),
              }}
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
    <Wrapper>
      <Header isFetching={isFetching} />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content}
        loading={isFetching}
        rowClassName={(record) =>
          record.status === ModelStatus.INACTIVE ? 'text-disabled' : ''
        }
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
          onChange: (page, pageSize) =>
            setSearchParams({
              ...params,
              page: page - 1,
              size: pageSize,
              isSearch: undefined,
            }),
        }}
      />
      <ZoneModal isOpen={isOpenZone} setIsOpen={setIsOpenZone} />
      <PackageModal isOpen={isOpenPackage} setIsOpen={setIsOpenPackage} />
      <ServiceModal isOpen={isOpenService} setIsOpen={setIsOpenService} />
      <PromotionModal isOpen={isOpenPromotion} setIsOpen={setIsOpenPromotion} />
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

export default SearchSubscriptionPage;
