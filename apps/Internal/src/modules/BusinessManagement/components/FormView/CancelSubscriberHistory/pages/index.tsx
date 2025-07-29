import { CButtonClose } from '@react/commons/Button';
import { CTable } from '@react/commons/index';
import { Wrapper } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { getDate } from '@react/utils/datetime';
import { Row, TableProps, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCancelSubscriberHistoryQuery } from '../hooks/useCancelSubscriberHistoryQuery';
import Header from '../components/Header';
import { CancelSubscriberHistory } from '../types';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

const CancelSubscriberHistoryPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { isFetching, data } = useCancelSubscriberHistoryQuery(
    queryParams({
      ...params,
      enterpriseId: id,
      fromDate:
        params.fromDate ?? dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  const columns: TableProps<CancelSubscriberHistory>['columns'] = [
    {
      title: 'STT',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => params.page * params.size + index + 1,
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 120,
      render: (value) => `0${value}`,
    },
    {
      title: 'Loại thuê bao',
      dataIndex: 'subType',
      width: 120,
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
      render: (value) => getDate(value, DateFormat.DATE_TIME),
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

export default CancelSubscriberHistoryPage;
