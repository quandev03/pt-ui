import { CButtonClose } from '@react/commons/Button';
import { CTable } from '@react/commons/index';
import { Wrapper } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { Row, TableProps, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useBlockOpenSubscriberHistoryQuery } from '../hooks/useBlockOpenSubscriberHistoryQuery';
import Header from '../components/Header';
import { BlockOpenSubscriberHistory } from '../types';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

const BlockOpenSubscriberHistoryPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { isFetching, data } = useBlockOpenSubscriberHistoryQuery(
    queryParams({
      ...params,
      enterpriseId: id,
      fromDate:
        params.fromDate ?? dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  const columns: TableProps<BlockOpenSubscriberHistory>['columns'] = [
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
      render: (value) => (
        <Tooltip
          title={impactTypeData?.find((item) => item.code === value)?.name}
          placement="topLeft"
        >
          {impactTypeData?.find((item) => item.code === value)?.name}
        </Tooltip>
      ),
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Loại thuê bao',
      dataIndex: 'subType',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Người/Thiết bị SD',
      dataIndex: 'name',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
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
      render: (value) => (
        <Tooltip
          title={getDate(value, DateFormat.DATE_TIME)}
          placement="topLeft"
        >
          {getDate(value, DateFormat.DATE_TIME)}
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
          {value ? 'Thực hiện gửi tin nhắn' : 'Không thực hiện gửi tin nhắn'}
        </Tooltip>
      ),
    },
  ];

  return (
    <Wrapper>
      <Header />
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content}
        loading={isFetching}
        otherHeight={60}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
        }}
      />
      <Row justify="end" className={data?.totalElements ? '' : 'mt-5'}>
        <CButtonClose onClick={() => navigate(pathRoutes.businessManagement)} />
      </Row>
    </Wrapper>
  );
};

export default BlockOpenSubscriberHistoryPage;
