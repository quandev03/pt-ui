import { CButtonDetail } from '@react/commons/Button';
import { CModalConfirm, CTooltip } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate } from '@react/utils/datetime';
import { Dropdown, TableColumnsType } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import {
  useDeleteDeliveryProgramPromotion,
  useListDeliveryProgramPromotion,
} from '../hooks';
import { ICategoryShippingPromotion } from '../types';

const DeliveryPromotionPage: React.FC = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const { data, isFetching: isLoadingList } = useListDeliveryProgramPromotion(
    queryParams(params)
  );
  const {
    DELIVERY_PROGRAM_PROMOTION_CHANNEL = [],
    DELIVERY_PROGRAM_PROMOTION_DELIVERY_PAYMENT_METHOD = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { mutate: onDelete } = useDeleteDeliveryProgramPromotion();

  const handleEditView = (type: ActionType, id: number) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.deliveryPromotionscategoryEdit(id)
        : pathRoutes.deliveryPromotionscategoryView(id)
    );
  };

  const handleDeleteItem = (id: string) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn xóa CTKM vận chuyển này không?',
      onOk: () => id && onDelete(id),
    });
  };

  const renderItems = (record: ICategoryShippingPromotion) =>
    [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
        isShow: includes(actionByRole, ActionsTypeEnum.UPDATE),
        onClick: () => {
          handleEditView(ActionType.EDIT, record.id);
        },
      },
      {
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text type="danger">
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
        isShow: includes(actionByRole, ActionsTypeEnum.DELETE),
        onClick: () => {
          handleDeleteItem(String(record.id));
        },
      },
    ].filter((e) => e.isShow);

  const columns: TableColumnsType<ICategoryShippingPromotion> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Tên chương trình khuyến mãi',
      dataIndex: 'programName',
      width: 110,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Kênh áp dụng',
      dataIndex: 'channel',
      width: 100,
      render: (values: string | undefined) => {
        if (values !== undefined) {
          const labels = values
            .split(',')
            .filter(Boolean)
            .map(
              (value) =>
                DELIVERY_PROGRAM_PROMOTION_CHANNEL.find(
                  (item) => item.value === value.trim()
                )?.label || value.trim()
            );

          const text = labels.join(', ');
          return <CTooltip title={text}>{text}</CTooltip>;
        }
        return '';
      },
    },
    {
      title: 'HTTT',
      dataIndex: 'deliveryPaymentMethod',
      width: 100,
      render: (values: string | undefined) => {
        if (values !== undefined) {
          const labels = values
            .split(',')
            .filter(Boolean)
            .map(
              (value) =>
                DELIVERY_PROGRAM_PROMOTION_DELIVERY_PAYMENT_METHOD.find(
                  (item) => item.value === value.trim()
                )?.label || value.trim()
            );

          const text = labels.join(', ');
          return <CTooltip title={text}>{text}</CTooltip>;
        }
        return '';
      },
    },
    {
      title: 'Ngày áp dụng',
      dataIndex: 'deliveryPaymentMethod',
      width: 150,
      render: (_: string, record: AnyElement) => {
        const label = `${getDate(record?.startDate)} - ${getDate(
          record?.endDate
        )}`;
        return <CTooltip title={label}>{label}</CTooltip>;
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
      title: 'Thao tác',
      dataIndex: 'id',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        const items = renderItems(record);
        return (
          <WrapperActionTable>
            {includes(actionByRole, ActionsTypeEnum.READ) && (
              <CButtonDetail
                type="default"
                onClick={() => handleEditView(ActionType.VIEW, record.id)}
              />
            )}
            <div className="w-5">
              {items && items.length > 0 && (
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

  return (
    <>
      <Header />
      <CTable
        columns={columns}
        rowKey={'id'}
        dataSource={data?.content ?? []}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        otherHeight={60}
        loading={isLoadingList}
      />
    </>
  );
};

export default DeliveryPromotionPage;
