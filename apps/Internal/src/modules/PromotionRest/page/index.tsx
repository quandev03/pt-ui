import { CButtonDetail } from '@react/commons/Button';
import { CTag, CTooltip } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { Text } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import { formatDateV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { Dropdown, Space, TableColumnsType, Tooltip } from 'antd';
import { MenuProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { optionStatusPromotionRest } from '../contants';
import { useListPromotionRest } from '../hooks';
import { EStatusPromotionRest, IPromotionRest } from '../types';

const PromotionRestPage: React.FC = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const { data, isFetching: isLoadingList } = useListPromotionRest(
    queryParams({
      ...params,
      dateType: params.dateType && params.dateType,
      fromDate:
        params.fromDate &&
        dayjs(params.fromDate, formatDateV2).format(formatDateV2),
      toDate:
        params.toDate &&
        dayjs(params.toDate, formatDateV2).format(formatDateV2),
    })
  );

  const handleEditView = (type: ActionType, id: number) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.promotionRestEdit(id)
        : pathRoutes.promotionRestView(id)
    );
  };

  const renderMenuItemsMore = (record: IPromotionRest): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => handleEditView(ActionType.EDIT, record.id)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
    ];
  };

  const columns: TableColumnsType<IPromotionRest> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Mã CTKM',
      dataIndex: 'promotionCode',
      width: 180,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Tên CTKM',
      dataIndex: 'name',
      width: 200,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 160,
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
      width: 160,
      render: (value: string, record) => {
        return (
          record.createdDate !== record.modifiedDate && (
            <CTooltip title={value}>{value}</CTooltip>
          )
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      render: (value: string, record) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render: (value) => {
        const label =
          optionStatusPromotionRest.find(
            (item) => String(item.value) === String(value)
          )?.label || '';
        const color =
          value === EStatusPromotionRest.ACTIVE
            ? ColorList.SUCCESS
            : ColorList.CANCEL;
        return (
          label && (
            <Tooltip title={label} placement="topLeft">
              <CTag color={color}>{label}</CTag>
            </Tooltip>
          )
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 180,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          {includes(actionByRole, ActionsTypeEnum.READ) && (
            <CButtonDetail
              type="default"
              onClick={() => handleEditView(ActionType.VIEW, record.id)}
            />
          )}
          {includes(actionByRole, ActionsTypeEnum.UPDATE) && (
            <Dropdown
              menu={{ items: renderMenuItemsMore(record) }}
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

export default PromotionRestPage;
