import { useMemo } from 'react';
import { CButtonDetail } from '@react/commons/Button';
import { CModalConfirm, CTable, CTooltip } from '@react/commons/index';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { Dropdown, Space, TableColumnsType } from 'antd';
import { MenuProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import {
  useListDeliveryFeeCategory,
  useDeleteDeliveryFeeCategory,
} from '../hooks';
import { ICategoryDeliveryFee } from '../types';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { includes } from 'lodash';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { useArea } from 'apps/Internal/src/hooks/useArea';
import { Wrapper } from './style';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';

const DeliveryFeePage: React.FC = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const { data, isFetching: isLoadingList } = useListDeliveryFeeCategory(
    queryParams(params)
  );
  const {
    DELIVERY_FEE_PAYMENT_METHOD = [],
    DELIVERY_FEE_DELIVERY_METHOD = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { mutate: onDelete } = useDeleteDeliveryFeeCategory();

  const handleEditView = (type: ActionType, id: number) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.deliveryFeecategoryEdit(id)
        : pathRoutes.deliveryFeecategoryView(id)
    );
  };

  const handleDeleteItem = (id: string) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn xóa cấu hình phí vận chuyển này không?',
      onOk: () => id && onDelete(id),
    });
  };

  const { data: provinces } = useArea('provinces', '');
  const optionsProvinces = useMemo(() => {
    if (!provinces) {
      return [];
    }
    return provinces.map((province) => ({
      label: province.areaName,
      value: province.areaCode,
      id: province.id,
    }));
  }, [provinces]);

  const renderItems = (record: ICategoryDeliveryFee) =>
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

  const columns: TableColumnsType<AnyElement> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, record, index) => {
        return !record.deliveryMethod ? (
          <Text>{index + 1 + params.page * params.size}</Text>
        ) : (
          ''
        );
      },
    },
    {
      title: 'Tên khu vực',
      dataIndex: 'locationName',
      width: 120,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Điểm đi',
      dataIndex: 'fromProvince',
      width: 150,
      render: (value: string) => {
        const text = optionsProvinces
          ? optionsProvinces.find((item) => item.value === value)?.label
          : '';
        return <CTooltip title={text}>{text}</CTooltip>;
      },
    },

    {
      title: 'Điểm đến',
      dataIndex: 'toProvinces',
      width: 150,
      className: 'provinces',
      render: (values: string[] | undefined) => {
        if (values !== undefined) {
          const labels = values
            .map(
              (value) =>
                optionsProvinces.find((item) => item.value === value)?.label
            )
            .filter(Boolean);

          const textSlice =
            labels.length > 3
              ? `${labels.slice(0, 3).join(', ')}...`
              : labels.join(', ');
          const tooltip = labels.join(', ');
          return <CTooltip title={tooltip}>{textSlice}</CTooltip>;
        }
      },
    },
    {
      title: 'Hình thức vận chuyển',
      dataIndex: 'deliveryMethod',
      width: 120,
      render: (value: string) => {
        const label = DELIVERY_FEE_DELIVERY_METHOD?.find(
          (item) => item.value === value
        )?.label;
        if (label) {
          return <CTooltip title={label}>{label}</CTooltip>;
        } else {
          return <CTooltip title={value}>{value}</CTooltip>;
        }
      },
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      width: 120,
      render: (value: string) => {
        const label = DELIVERY_FEE_PAYMENT_METHOD?.find(
          (item) => item.value === value
        )?.label;
        if (label) {
          return <CTooltip title={label}>{label}</CTooltip>;
        } else {
          return <CTooltip title={value}>{value}</CTooltip>;
        }
      },
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'fee',
      width: 120,
      render: (value: string) => {
        const label = value
          ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          : '';
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
        return !record.deliveryMethod ? (
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
        ) : (
          ''
        );
      },
    },
  ];

  const dataSource =
    data?.content.map((item, index) => ({
      ...item,
      key: item.id,
      stt: index + 1,
      children: item.deliveryFees.map((fee, idx) => ({
        key: `${item.id}-${idx}`,
        deliveryMethod: fee.deliveryMethod,
        paymentMethod: fee.paymentMethod,
        fee: fee.fee,
      })),
    })) ?? [];

  return (
    <Wrapper>
      <Header provinces={optionsProvinces} />
      <CTable
        rowKey={'id'}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        otherHeight={60}
        loading={isLoadingList}
      />
    </Wrapper>
  );
};

export default DeliveryFeePage;
