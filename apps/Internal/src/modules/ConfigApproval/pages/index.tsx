import { CButtonDetail } from '@react/commons/Button';
import { CModalConfirm, CTooltip } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { MESSAGE } from '@react/utils/message';
import { Dropdown, MenuProps, Space, TableColumnsType, Tooltip } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useListOrgUnit } from 'apps/Internal/src/hooks/useListOrgUnit';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useDeleteConfig } from '../hooks/useDeleteConfig';
import { useListConfig } from '../hooks/useListConfig';
import { ConfigApprovalType } from '../types';

const ConfigApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const { data, isFetching: isLoadingList } = useListConfig(
    queryParams(params)
  );
  const { mutate: mutateDelete, isPending: isLoadingDelete } =
    useDeleteConfig();
  const { data: listOrgUnit = [], isFetching: isLoadingOrgUnit } =
    useListOrgUnit({
      status: 1,
    });
  const handleView = (id: string) => {
    navigate(pathRoutes.config_approval_view(id));
  };
  const handleEdit = (id: string) => {
    navigate(pathRoutes.config_approval_edit(id));
  };

  const handleDelete = (id: string) => {
    CModalConfirm({
      message: MESSAGE.G05,
      onOk: () => id && mutateDelete(id),
    });
  };
  const renderMenuItemsMore = (id: string): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => handleEdit(id)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      },
      {
        key: ActionsTypeEnum.DELETE,
        label: (
          <Text type="danger" onClick={() => handleDelete(id)}>
            <FormattedMessage id={'common.delete'} />
          </Text>
        ),
      },
    ];
  };
  const columns: TableColumnsType<ConfigApprovalType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{idx + 1}</div>;
      },
    },
    {
      title: 'Quy trình',
      dataIndex: 'processName',
      width: 150,
      render: (value: string) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Kho',
      dataIndex: 'orgId',
      width: 120,
      render: (value: number) => {
        const unitName = listOrgUnit.find((e) => e.value === value)?.label;
        return (
          <Tooltip title={unitName} placement="topLeft">
            {unitName}
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 100,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      render: (value: string) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {dayjs(value, DateFormat.DEFAULT_SHORT).format(DateFormat.DEFAULT)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 100,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 100,
      render: (value: string) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {dayjs(value, DateFormat.DEFAULT_SHORT).format(DateFormat.DEFAULT)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: (value) => (
        <WrapperActionTable>
          <CButtonDetail type="default" onClick={() => handleView(value)} />
          <Dropdown
            menu={{ items: renderMenuItemsMore(value) }}
            placement="bottom"
            trigger={['click']}
          >
            <IconMore className="cursor-pointer" />
          </Dropdown>
        </WrapperActionTable>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        loading={isLoadingList || isLoadingDelete || isLoadingOrgUnit}
      />
    </>
  );
};

export default ConfigApprovalPage;
