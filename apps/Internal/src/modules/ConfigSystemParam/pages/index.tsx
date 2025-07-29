import { CButtonDetail } from '@react/commons/Button';
import { CTagActive, CTooltip } from '@react/commons/index';
import CTable from '@react/commons/Table';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Dropdown, MenuProps, Space, TableColumnsType } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import {
  OrgUnitType,
  queryKeyListOrgUnit,
} from 'apps/Internal/src/hooks/useListOrgUnit';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useListConfig } from '../hooks/useListConfig';
import { ConfigSystemParamType } from '../types';
import { getDate } from '@react/utils/datetime';

const ConfigSystemParamPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    fromDate: dayjs().toString(),
    toDate: dayjs().toString(),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const { data, isFetching: isLoadingList } = useListConfig(
    queryParams(params)
  );
  const listOrgUnit =
    useGetDataFromQueryKey<OrgUnitType[]>([
      queryKeyListOrgUnit,
      { status: 1 },
    ]) ?? [];
  const handleView = (id: string) => {
    navigate(pathRoutes.configSystemParamView(id));
  };
  const handleEdit = (id: string) => {
    navigate(pathRoutes.configSystemParamEdit(id));
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
    ];
  };
  const columns: TableColumnsType<ConfigSystemParamType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      render: (_, __, idx: number) => {
        return <div>{idx + 1}</div>;
      },
    },
    {
      title: 'Loại cấu hình',
      dataIndex: 'type',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Mã cấu hình',
      dataIndex: 'code',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Tên cấu hình',
      dataIndex: 'name',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      width: 130,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Loại dữ liệu',
      dataIndex: 'dataType',
      width: 130,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: <div title="Trạng thái Kênh BCSS">TT Kênh BCSS</div>,
      dataIndex: 'status',
      width: 130,
      render: (value: number) => {
        return <CTagActive value={value} />;
      },
    },
    {
      title: <div title="Trạng thái Kênh online">TT Kênh online</div>,
      dataIndex: 'statusOnline',
      width: 130,
      render: (value: number) => {
        return <CTagActive value={value} />;
      },
    },

    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 150,
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
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 115,
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
        loading={isLoadingList}
      />
    </>
  );
};

export default ConfigSystemParamPage;
