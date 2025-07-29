import { CButtonAdd, CButtonDetail } from '@react/commons/Button';
import { CReloadButton } from '@react/commons/ReloadButton';
import CustomSearch from '@react/commons/Search';
import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
  WrapperButton,
} from '@react/commons/Template/style';
import { ModelStatus } from '@react/commons/types';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDeleteFn } from '../queryHook/useDelete';
import { convertArrToObj, useList } from '../queryHook/useList';
import { ContentItem } from '../types';
import { ColorList } from '@react/constants/color';

const Body = () => {
  const navigate = useNavigate();
  const [searchValueFake, setSearchValueFake] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { isLoading: loadingTable, data: dataTable, refetch } = useList();
  const searchValue = params.text || '';

  const intl = useIntl();
  const actionByRole = useRolesByRouter();
  const { mutate: deleteMutate } = useDeleteFn();

  useEffect(() => {
    if (params) {
      setSearchValueFake(params.text || '');
    }
  }, []);

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    const arr = [
      {
        key: ActionsTypeEnum.UPDATE,
        onClick: () => openModalEditView(ActionType.EDIT, record),
        label: (
          <Text>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
    ];
    if (record.parentId !== null) {
      arr.push({
        key: ActionsTypeEnum.DELETE,
        onClick: () => handleDeleteItem(record.id),
        label: (
          <Text type="danger">
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
      });
    }
    return arr.filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
      includes(actionByRole, item?.key)
    );
  };

  const textRender = (children: any, record: ContentItem) => {
    return (
      <Text disabled={record.status === ModelStatus.INACTIVE}>{children}</Text>
    );
  };

  const handleAdd = () => {
    navigate(pathRoutes.listOfDepartmentAdd);
  };

  const columns: ColumnsType<ContentItem> = [
    {
      title: 'Tên kho',
      dataIndex: 'orgName',
      width: 280,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã kho',
      dataIndex: 'orgCode',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value.toUpperCase(), record)}
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
            {textRender(value, record)}
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
            title={dayjs(value).format(DateFormat.DATE_TIME)}
            placement="topLeft"
          >
            {textRender(dayjs(value).format(DateFormat.DEFAULT), record)}
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
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.updatedDate' }),
      dataIndex: 'modifiedDate',
      width: 120,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(DateFormat.DATE_TIME)}
            placement="topLeft"
          >
            {textRender(dayjs(value).format(DateFormat.DEFAULT), record)}
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
            <CTag
              color={
                value === ModelStatus.ACTIVE
                  ? ColorList.SUCCESS
                  : ColorList.DEFAULT
              }
            >
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
      hidden: !actionByRole?.some((item) =>
        includes(
          [
            ActionsTypeEnum.READ,
            ActionsTypeEnum.UPDATE,
            ActionsTypeEnum.DELETE,
          ],
          item
        )
      ),
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

  const handleDeleteItem = (id: string) => {
    if (id) {
      ModalConfirm({
        message: 'common.confirmDelete',
        handleConfirm: () => {
          deleteMutate(id);
        },
      });
    }
  };

  const openModalEditView = (type: ActionType, record: ContentItem) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.listOfDepartmentEdit(record.id)
        : pathRoutes.listOfDepartmentView(record.id)
    );
  };

  const handleSearch = () => {
    setSearchParams({ text: searchValueFake });
    refetch();
  };

  const handleRefresh = () => {
    setSearchValueFake('');
    setSearchParams({});
    refetch();
  };

  return (
    <div>
      <TitleHeader>Danh mục kho</TitleHeader>
      <RowHeader>
        <WrapperButton>
          <CustomSearch
            tooltip="Nhập mã hoặc tên kho để tìm kiếm"
            onSearch={handleSearch}
            value={searchValueFake}
            setValue={setSearchValueFake}
          />
          <CReloadButton onClick={handleRefresh} />
        </WrapperButton>
        <BtnGroupFooter>
          {includes(actionByRole, ActionsTypeEnum.CREATE) && (
            <CButtonAdd onClick={handleAdd} />
          )}
        </BtnGroupFooter>
      </RowHeader>
      {!loadingTable && (
        <CTable
          rowKey="id"
          expandable={{ defaultExpandAllRows: true }}
          loading={loadingTable}
          columns={columns}
          dataSource={
            convertArrToObj(
              dataTable?.filter((obj: any) =>
                (obj.orgCode + obj.orgName)
                  ?.toString()
                  .toLowerCase()
                  .includes(searchValue?.toString().toLowerCase())
              ),
              null
            ) || []
          }
          pagination={false}
        />
      )}
    </div>
  );
};

export default Body;
