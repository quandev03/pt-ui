import CTable from '@react/commons/Table';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useSearchParams } from 'react-router-dom';
import { TableProps, Tooltip } from 'antd';
import { SubscriberNoImpact } from '../types';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { Wrapper } from '@react/commons/Template/style';
import { useSubscriberNoImpactQuery } from '../hooks/useSubscriberNoImpactQuery';
import HeaderSubscriberNoImpact from '../components/HeaderSubscriberNoImpact';
import { getDate } from '@react/utils/datetime';
import useSubscriptionStore from '../store';
import { useEffect } from 'react';

const SubscriberNoImpactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { subscriberNoImpactIds, setSubscriberNoImpactIds } =
    useSubscriptionStore();
  const { isFetching, data } = useSubscriberNoImpactQuery(
    queryParams({
      ...params,
      fromDate:
        params.fromDate ?? dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
      toDate: params.toDate ?? dayjs().format(DateFormat.DEFAULT),
    })
  );

  useEffect(() => {
    return () => setSubscriberNoImpactIds([]);
  }, []);

  const columns: TableProps<SubscriberNoImpact>['columns'] = [
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
      width: 130,
    },
    {
      title: 'Tên khách hàng',
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
      width: 180,
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

  const rowSelection = {
    selectedRowKeys: subscriberNoImpactIds,
    preserveSelectedRowKeys: true,
    onChange: (keys: React.Key[]) => setSubscriberNoImpactIds(keys),
  };

  return (
    <Wrapper>
      <HeaderSubscriberNoImpact />
      <CTable
        rowKey="subId"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data?.content}
        loading={isFetching}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: data?.totalElements,
        }}
      />
    </Wrapper>
  );
};

export default SubscriberNoImpactPage;
