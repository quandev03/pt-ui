import { Dropdown, MenuProps, TablePaginationConfig, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ContentItem, RoleItem, UserItem } from '../types';
import includes from 'lodash/includes';
import CTable from '@react/commons/Table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { CButtonDetail } from '@react/commons/Button';
import dayjs from 'dayjs';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import {
  ACTION_MODE_ENUM,
  IParamsRequest,
  ModelStatus,
} from '@react/commons/types';
import useGroupStore from '../store';
import { useSupportDeleteGroup } from '../queryHook';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { useGetGroupUsers } from 'apps/Internal/src/modules/UserGroupManagement/queryHook';

const Body = () => {
  const [heightTable, setHeightTable] = useState(0);
  const [params, setParams] = useState<IParamsRequest>({
    page: 0,
    size: 10,
    q: '',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const intl = useIntl();
  const actionByRole = useRolesByRouter();
  const { data, isLoading: loadingTable } = useGetGroupUsers(params);
  const { setGroupDetail, setListRoleStatus0, setListUserStatus0 } =
    useGroupStore();
  const { mutate: deleteGroup } = useSupportDeleteGroup(() => {
    setSelectedRowKeys([]);
  });

  const onSelectChange = useCallback((newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text
            onClick={() => openModalEditView(ACTION_MODE_ENUM.EDIT, record)}
          >
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
    ].filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
      includes(actionByRole, item?.key)
    );
  };

  const columns: ColumnsType<ContentItem> = [
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
      dataIndex: 'code',
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
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
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
      dataIndex: 'lastModifiedBy',
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
      dataIndex: 'lastModifiedDate',
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
            <Text
              disabled={value === ModelStatus.INACTIVE}
              type={value === ModelStatus.ACTIVE ? 'success' : undefined}
            >
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
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
                onClick={() => openModalEditView(ACTION_MODE_ENUM.VIEW, record)}
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

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        message: 'common.confirmDelete',
        handleConfirm: () => {
          deleteGroup([id]);
        },
      });
    }
  };

  const openModalEditView = (type: ACTION_MODE_ENUM, record: ContentItem) => {
    setGroupDetail({
      ...record,
      roleIds: record.roles.map((item) => item.id),
      userIds: record.users.map((user) => user.id),
    });
    const actionByRole: string[] = [];
    const listOptionRole: RoleItem[] = [];
    record?.roles?.forEach((item: RoleItem) => {
      actionByRole.push(item.id);
      if (item.status === 0) {
        listOptionRole.push(item);
      }
    });

    const listUser: string[] = [];
    const listOptionUser: UserItem[] = [];
    record?.users?.forEach((item) => {
      listUser.push(item.id);
      if (item.status === 0) {
        listOptionUser.push(item);
      }
    });
    setListRoleStatus0(listOptionRole);
    setListUserStatus0(listOptionUser);
  };

  const handleChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      setParams({
        ...params,
        page: (pagination.current as number) - 1,
        size: pagination.pageSize as number,
      });
    },
    [params]
  );

  const changeHeightTable = () => {
    const heightWrapper =
      document.getElementById('wrapperUserGroup')?.offsetHeight;
    setHeightTable((heightWrapper ?? 0) - 205);
  };

  useEffect(() => {
    const id = setTimeout(changeHeightTable, 500);
    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <div>
      <CTable
        rowSelection={rowSelection}
        loading={loadingTable}
        columns={columns}
        rowKey={'id'}
        dataSource={data?.content || []}
        scroll={{ y: heightTable }}
        pagination={{
          total: data?.totalElements,
        }}
        onChange={handleChangeTable}
      />
    </div>
  );
};

export default Body;
