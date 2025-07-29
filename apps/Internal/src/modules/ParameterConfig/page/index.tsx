import { CButtonAdd, CButtonDetail } from '@react/commons/Button';
import { CModalConfirm, CTable, CTag, CTooltip } from '@react/commons/index';
import { CReloadButton } from '@react/commons/ReloadButton';
import CustomSearch from '@react/commons/Search';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
  WrapperButton,
} from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { Dropdown, Space, TableColumnsType } from 'antd';
import { MenuProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDeleteParameterConfig, useListParameterConfig } from '../hooks';
import { ICategoryParameterConfig } from '../types';
import { Wrapper } from './style';
import { ColorList } from '@react/constants/color';

export enum Status {
  INACTIVE = 0,
  ACTIVE = 1,
}

export const COLOR_STATUS: Record<Status, 'error' | 'success'> = {
  [Status.INACTIVE]: ColorList.FAIL,
  [Status.ACTIVE]: ColorList.SUCCESS,
};

const ParameterConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValueFake, setSearchValueFake] = useState<string>('');
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const { data, isFetching: isLoadingList } = useListParameterConfig(
    queryParams(params)
  );
  const { mutate: onDelete } = useDeleteParameterConfig();

  const optionStatus = [
    { label: 'Không hoạt động', value: 0 },
    { label: 'Hoạt động', value: 1 },
  ];

  //search
  useEffect(() => {
    if (params) {
      setSearchValueFake(params.param || '');
    }
  }, []);

  const handleSearch = (values: any) => {
    setSearchParams({
      ...params,
      param: values ? values.trim() : undefined,
      page: 0,
    });
  };

  const handleRefresh = useCallback(() => {
    setSearchParams({});
    setSearchValueFake('');
  }, []);

  const handleAdd = () => {
    navigate(pathRoutes.parameterConfigAdd);
  };

  //table hanlde
  const handleEditView = (type: ActionType, id: number) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.parameterConfigEdit(id)
        : pathRoutes.parameterConfigView(id)
    );
  };

  const handleDeleteItem = (id: string) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn xóa cấu hình tham số này không?',
      onOk: () => id && onDelete(id),
    });
  };

  const renderMenuItemsMore = (record: ICategoryParameterConfig) =>
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

  const columns: TableColumnsType<ICategoryParameterConfig> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, index) => (
        <Text>{index + 1 + params.page * params.size}</Text>
      ),
    },
    {
      title: 'Tên bảng',
      dataIndex: 'tableName',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Tên cột',
      dataIndex: 'columnName',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'CODE',
      dataIndex: 'code',
      width: 120,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      width: 120,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Loại dữ liệu',
      dataIndex: 'valueType',
      width: 120,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'ID tham chiếu',
      dataIndex: 'refId',
      width: 120,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Mặc định',
      dataIndex: 'isDefault',
      width: 120,
      render(value) {
        const label = value ? 'Có' : 'Không';
        return (
          <CTooltip title={label} placement="topLeft">
            <Text>{label}</Text>
          </CTooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render(value) {
        const text = optionStatus.find((item) => item.value === value)?.label;

        return (
          <CTooltip title={text} placement="topLeft">
            <CTag bordered={false} color={COLOR_STATUS[value as Status]}>
              {text}
            </CTag>
          </CTooltip>
        );
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
        const items = renderMenuItemsMore(record);
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

  const dataSource =
    data?.content.map((item, index) => ({
      ...item,
      key: item.id,
      stt: index + 1,
    })) ?? [];

  return (
    <Wrapper>
      {/* <Header /> */}

      <TitleHeader>Cấu hình tham số hệ thống</TitleHeader>
      <RowHeader>
        <WrapperButton>
          <CustomSearch
            tooltip={'Tìm kiếm theo tên bảng, tên cột, code, giá trị'}
            onSearch={handleSearch}
            value={searchValueFake}
            setValue={setSearchValueFake}
          />
          <CReloadButton onClick={handleRefresh} />
        </WrapperButton>
        <BtnGroupFooter>
          {includes(actionByRole, ActionsTypeEnum.CREATE) && (
            <CButtonAdd onClick={handleAdd}>
              <FormattedMessage id="common.add" />
            </CButtonAdd>
          )}
        </BtnGroupFooter>
      </RowHeader>
      <CTable
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        loading={isLoadingList}
      />
    </Wrapper>
  );
};

export default ParameterConfigPage;
