import CButton, { CButtonDetail } from '@react/commons/Button';
import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDelete } from '../hooks/useDelete';
import { useList } from '../hooks/useList';
import { ISupplierItem } from '../types';
import Header from './Header';
import { includes } from 'lodash';

const Body = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const intl = useIntl();
  const actionByRole = useRolesByRouter();
  const { data, isLoading: loadingTable } = useList(queryParams(params));
  const { mutate: deleteSupplier } = useDelete();
  const openModalEditView = (type: ActionType, record: ISupplierItem) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.supplier_edit(record.id)
        : pathRoutes.supplier_view(record.id)
    );
  };
  const handleDeleteItem = useCallback(
    (id: number) => {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn xóa?',
        handleConfirm: () => {
          deleteSupplier(id);
        },
      });
    },
    [deleteSupplier]
  );
  const renderMenuItemsMore = (record: ISupplierItem): MenuProps['items'] => {
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
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text type="danger" onClick={() => handleDeleteItem(record.id)}>
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
      },
    ];
    // .filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
    //   includes(actionByRole, item?.key)
    // );
  };

  const columns: ColumnsType<ISupplierItem> = [
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
      title: 'Mã NCC',
      dataIndex: 'supplierCode',
      width: 120,
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
      title: 'Tên nhà cung cấp',
      dataIndex: 'supplierName',
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
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {dayjs(value).format(formatDate)}
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
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },

    {
      title: intl.formatMessage({ id: 'role.statusName' }),
      dataIndex: 'status',

      width: 150,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            }
            placement="topLeft"
          >
            <CTag color={value === ModelStatus.ACTIVE ? 'green' : 'default'}>
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            </CTag>
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
              {(includes(actionByRole, ActionsTypeEnum.UPDATE) ||
                includes(actionByRole, ActionsTypeEnum.DELETE)) && (
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
        loading={loadingTable}
        columns={columns}
        rowKey={'id'}
        dataSource={data?.content || []}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
        }}
      />
    </div>
  );
};

export default Body;
