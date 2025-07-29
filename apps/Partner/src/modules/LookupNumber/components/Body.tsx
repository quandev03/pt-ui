import CTable from '@react/commons/Table';
import { Text } from '@react/commons/Template/style';
import { ParamsOption } from '@react/commons/types';
import {
  decodeSearchParams,
  formatCurrencyVND,
  queryParams,
} from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../queryHook/useSearch';
import CTag from '@react/commons/Tag';
import { STOCK_ISDN_STATUS_COLOR, TRANSFER_STATUS_ENUM } from '../constant';

const Body = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: searchData, isFetching } = useSearch(queryParams(params));

  const { STOCK_ISDN_STATUS = [] } =
  useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS_OPTION]);

  const columns: ColumnsType = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render: (value, record, index) => (
        <Tooltip title={index + 1 + params.page * params.size} placement="topLeft">
          <Text>{index + 1 + params.page * params.size}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Số',
      dataIndex: 'isdn',
      width: 180,
      align: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      width: 180,
      align: 'left',
      render: (value) => (
        <Tooltip
          title={formatCurrencyVND(Number(value))}
          placement="topLeft"
        >
          <Text>{formatCurrencyVND(Number(value))}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 180,
      align: 'left',
      render: (value) => {
        const text = STOCK_ISDN_STATUS.find(
          (item) => item.value == value
        )?.label;
        return (
          <Tooltip title={text} placement="topLeft">
          <CTag
            color={STOCK_ISDN_STATUS_COLOR[value as TRANSFER_STATUS_ENUM]}
          >
            {text}
          </CTag>
        </Tooltip>

        );
      },
    },
  ];
  return (
    <CTable
        rowKey="id"
        columns={columns}
        dataSource={searchData?.content || []}
        loading={isFetching}
        pagination={{
          total: searchData?.totalElements,
        }}
      />
  );
};
export default Body;
