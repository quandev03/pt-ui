import CTable from '@react/commons/Table';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, TableProps, Tooltip } from 'antd';
import { SmsHistory } from '../types';
import { CButtonClose } from '@react/commons/Button';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { Wrapper } from '@react/commons/Template/style';
import { useSmsHistoryQuery } from '../hooks/useSmsHistoryQuery';
import HeaderSmsHistory from '../components/HeaderSmsHistory';
import { getDate } from '@react/utils/datetime';

const SmsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { isFetching, data } = useSmsHistoryQuery(
    queryParams({
      ...params,
      id,
      fromDate:
        params.fromDate ?? dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  const columns: TableProps<SmsHistory>['columns'] = [
    {
      title: 'STT',
      align: 'center',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => params.page * params.size + index + 1,
    },
    {
      title: 'Đầu số gửi',
      dataIndex: 'desAddr',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'sendTime',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'receiverTime',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Nội dung tin nhắn',
      dataIndex: 'smsContent',
      className: '!whitespace-normal',
    },
  ];

  return (
    <Wrapper>
      <HeaderSmsHistory />
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

export default SmsHistoryPage;
