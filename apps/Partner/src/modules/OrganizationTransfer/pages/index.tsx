import { CButtonDetail } from '@react/commons/Button';
import { CTable, CTooltip } from '@react/commons/index';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { Space, TableColumnsType } from 'antd';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useListOrgTransfer } from '../hooks/useListOrg';
import { OrgTransferType } from '../types';

const OrgTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const actions = useRolesByRouter();
  const { data, isFetching: isLoadingList } = useListOrgTransfer(
    queryParams(params)
  );

  const handleView = (id: string) => {
    navigate(pathRoutes.viewOrganizationTransfer(id));
  };

  const columns: TableColumnsType<OrgTransferType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{page * size + idx + 1}</div>;
      },
    },
    {
      title: 'Kho xuất',
      dataIndex: 'orgName',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Kho nhận',
      dataIndex: 'ieOrgName',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày xuất',
      dataIndex: 'moveDate',
      width: 90,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 90,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
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
      title: 'Thao tác',
      dataIndex: 'id',
      width: 130,
      align: 'center',
      render: (value, record) => (
        <Space size="middle">
          {includes(actions, ActionsTypeEnum.READ) && (
            <CButtonDetail type="default" onClick={() => handleView(value)} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        rowKey={'id'}
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          total: data?.totalElements,
        }}
        loading={isLoadingList}
      />
    </>
  );
};

export default OrgTransferPage;
