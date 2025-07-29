import { CButtonDetail } from '@react/commons/Button';
import CSwitch from '@react/commons/Switch';
import CTable from '@react/commons/Table';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Dropdown, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { MenuProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEditStatus } from '../queryHook/useEditStatus';
import { useList } from '../queryHook/useList';
import { ServicePackageItem } from '../types';
import Header from './Header';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const Body = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { PACKAGE_PROFILE_GROUP_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { data: dataTable, isLoading: loadingTable } = useList(
    queryParams(params)
  );
  const { mutate: editStatus } = useEditStatus();
  const actionByRole = useRolesByRouter();
  const openModalEditView = (type: ActionType, record: ServicePackageItem) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.list_of_service_package_edit(record.id)
        : pathRoutes.list_of_service_package_view(record.id)
    );
  };
  const renderMenuItemsMore = (
    record: ServicePackageItem
  ): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => openModalEditView(ActionType.EDIT, record)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
      {
        key: ActionsTypeEnum.CREATE,
        label: (
          <Text
            onClick={() => navigate(pathRoutes.packageAuthorization(record.id))}
          >
            Phân quyền
          </Text>
        ),
      },
    ].filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
      includes(actionByRole, item?.key)
    );
  };
  const handleChangeStatus = useCallback(
    (record: ServicePackageItem) => {
      ModalConfirm({
        message:
          record.status === 0
            ? 'Bạn có chắc chắn muốn Mở khóa gói cước này không?'
            : 'Bạn có chắc chắn muốn Khóa gói cước này không?',
        handleConfirm: () => {
          editStatus(record);
        },
      });
    },
    [editStatus]
  );
  const columns: ColumnsType<ServicePackageItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return (
          <Text disabled={!record?.status}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Mã API',
      dataIndex: 'apiCode',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'SKY package code',
      dataIndex: 'pckCode',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên gói cước',
      dataIndex: 'pckName',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nhóm gói cước',
      dataIndex: 'groupType',
      width: 180,
      align: 'left',
      render(value, record) {
        const renderedValue =
          PACKAGE_PROFILE_GROUP_TYPE.find((item) => item.value === value)
            ?.label || '';
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text disabled={!record?.status}>{renderedValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại gói cước',
      dataIndex: 'pckTypeName',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại profile',
      dataIndex: 'profileTypeName',
      width: 180,
      align: 'left',
      render(value, record) {
        const profiles = value.filter((item: string) => item !== '').join(', ');
        return (
          <Tooltip title={profiles} placement="topLeft">
            <Text disabled={!record?.status}>{profiles}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip
            title={value === 1 ? 'Hoạt động' : 'Không hoạt động'}
            placement="topLeft"
          >
            <CSwitch
              value={value}
              onChange={() => handleChangeStatus(record)}
            />
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.creator' }),
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.creationDate' }),
      dataIndex: 'createdDate',

      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : ''}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {value ? dayjs(value).format(formatDate) : ''}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.updater' }),
      dataIndex: 'modifiedBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.updatedDate' }),
      dataIndex: 'modifiedDate',
      width: 130,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : ''}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {value ? dayjs(value).format(formatDate) : ''}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.action' }),
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            {includes(actionByRole, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() => openModalEditView(ActionType.VIEW, record)}
              />
            )}
             <div className="w-5">
              {includes(actionByRole, ActionsTypeEnum.UPDATE) && (
                <Dropdown
                  menu={{ items: renderMenuItemsMore(record) }}
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
    <div>
      <Header />
      <CTable
        columns={columns}
        dataSource={dataTable?.content}
        loading={loadingTable}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements,
        }}
      />
    </div>
  );
};
export default Body;
