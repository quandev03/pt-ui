import { Dropdown, MenuProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ContentItem } from '../types';
import CTable from '@react/commons/Table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
  WrapperButton,
} from '@react/commons/Template/style';
import CustomSearch from '@react/commons/Search';
import Button, { CButtonDetail } from '@react/commons/Button';
import { CReloadButton } from '@react/commons/ReloadButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useList } from '../queryHook/useList';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import CTag from '@react/commons/Tag';
import { ModelStatus } from '@react/commons/types';
import useGroupStore from '../store';

const Body = () => {
  const navigate = useNavigate();
  const [searchValueFake, setSearchValueFake] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const intl = useIntl();
  const { setIsAutoDefault } = useGroupStore();
  const { isLoading: loadingTable, data } = useList(params);

  const dataTable = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const handleSearch = (values: any) => {
    setSearchParams({
      ...params,
      'value-search': values,
      page: 0,
    });
  };
  useEffect(() => {
    if (!params['value-search']) setSearchValueFake('');
    else setSearchValueFake(params['value-search']);
  }, []);

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => openModalEditView(ActionType.EDIT, record)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
    ];
    // .filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
    //   includes(actionByRole, item?.key)
    // );
  };

  const dateHandler = (values: string) => {
    const year = values.slice(0, 4);
    const month = values.slice(5, 7);
    const day = values.slice(8, 10);
    return day + '/' + month + '/' + year;
  };

  const handleAdd = () => {
    if (dataTable?.totalElements === 0) setIsAutoDefault(true);
    else setIsAutoDefault(false);
    navigate(pathRoutes.category_profile_add);
  };

  const columns: ColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: intl.formatMessage({ id: 'Mã profile' }),
      dataIndex: 'code',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'Tên profile' }),
      dataIndex: 'value',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'Profile mặc định' }),
      dataIndex: 'isDefault',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Text>
            {value ? (
              <FontAwesomeIcon icon={faCircleCheck} color="green" />
            ) : (
              ''
            )}
          </Text>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'Trạng thái' }),
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip
            title={
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            }
            placement="topLeft"
          >
            <CTag color={value === ModelStatus.ACTIVE ? 'success' : 'default'}>
              <FormattedMessage
                id={value ? 'common.active' : 'common.inactive'}
              />
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'Người tạo' }),
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'Ngày tạo' }),
      dataIndex: 'createdDate',
      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dateHandler(value.split('T')[0]) + ' ' + value.split('T')[1]}
            placement="topLeft"
          >
            <Text>{dateHandler(value)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'categoryReason.updatedBy' }),
      dataIndex: 'modifiedBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'categoryReason.updatedDate' }),
      dataIndex: 'modifiedDate',
      width: 120,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dateHandler(value.split('T')[0]) + ' ' + value.split('T')[1]}
            placement="topLeft"
          >
            <Text>{dateHandler(value)}</Text>
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
            <CButtonDetail
              onClick={() => openModalEditView(ActionType.VIEW, record)}
            />
            <Dropdown
              menu={{ items: renderMenuItemsMore(record) }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="iconMore" />
            </Dropdown>
          </WrapperActionTable>
        );
      },
    },
  ];

  const openModalEditView = (type: ActionType, record: ContentItem) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.category_profile_edit(record.id)
        : pathRoutes.category_profile_view(record.id)
    );
  };

  const handleRefresh = useCallback(() => {
    setSearchParams({});
    setSearchValueFake('');
  }, []);

  return (
    <div>
      <TitleHeader>Danh mục profile</TitleHeader>
      <RowHeader>
        <WrapperButton>
          <CustomSearch
            tooltip={intl.formatMessage({
              id: 'Tìm kiếm theo tên hoặc mã profile',
            })}
            onSearch={handleSearch}
            value={searchValueFake}
            setValue={setSearchValueFake}
          />
          <CReloadButton onClick={handleRefresh} />
        </WrapperButton>
        <BtnGroupFooter>
          <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={handleAdd}>
            <FormattedMessage id="common.add" />
          </Button>
        </BtnGroupFooter>
      </RowHeader>
      <CTable
        rowKey="id"
        loading={loadingTable}
        columns={columns}
        dataSource={dataTable?.content}
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
