import CTable from '@react/commons/Table';
import HeaderPackageHistory from '../components/HeaderPackageHistory';
import { usePackageHistoryQuery } from '../hooks/usePackageHistoryQuery';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, TableProps, Tooltip } from 'antd';
import { ImpactHistory, PackageDateType } from '../types';
import { CButtonClose } from '@react/commons/Button';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { Wrapper } from '@react/commons/Template/style';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { getDate } from '@react/utils/datetime';

const PackageHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { isFetching, data } = usePackageHistoryQuery(
    id ?? '',
    queryParams({
      ...params,
      typeDate: params.typeDate ?? PackageDateType.IMPLEMENT,
      fromDate:
        params.fromDate ?? dayjs().subtract(6, 'M').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  const columns: TableProps<ImpactHistory>['columns'] = [
    {
      title: 'STT',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => params.page * params.size + index + 1,
    },
    {
      title: 'Loại tác động',
      dataIndex: 'actionCode',
      width: 160,
      render: (value) =>
        impactTypeData?.find((item) => item.code === value)?.name,
    },
    {
      title: 'User thực hiện',
      dataIndex: 'actionUser',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'actionDate',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'timeStart',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'timeEnd',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Đơn vị kích hoạt',
      dataIndex: 'shopCode',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Nhân viên kích hoạt',
      dataIndex: 'activeUser',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Nhân viên phát triển',
      dataIndex: 'developmentUser',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Lý do',
      width: 200,
      render: (_, { reasonName, reasonNote }) => (
        <Tooltip title={reasonNote ?? reasonName} placement="topLeft">
          {reasonNote ?? reasonName}
        </Tooltip>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 220,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
  ];

  return (
    <Wrapper>
      <HeaderPackageHistory />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content}
        loading={isFetching}
        otherHeight={50}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
          onChange: (page, pageSize) =>
            setSearchParams(
              {
                ...params,
                page: page - 1,
                size: pageSize,
              },
              { replace: true }
            ),
        }}
      />
      <Row justify="end" className={data?.totalElements ? '' : 'mt-5'}>
        <CButtonClose onClick={() => navigate(-1)} />
      </Row>
    </Wrapper>
  );
};

export default PackageHistoryPage;
