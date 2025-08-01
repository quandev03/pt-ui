import {
  AnyElement,
  CTag,
  decodeSearchParams,
  formatCurrencyVND,
  formatDate,
  formatDateTime,
  formatQueryParams,
  LayoutList,
  Text,
  TypeTagEnum,
} from '@vissoft-react/common';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import {
  STOCK_ISDN_STATUS_COLOR,
  STOCK_ISDN_TRANSFER_STATUS_COLOR,
  TRANSFER_STATUS_ENUM,
} from '../constant';
import { useFilters } from '../queryHook';
import { useSearch } from '../queryHook/useSearch';

const Body = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: searchData, isFetching } = useSearch(formatQueryParams(params));

  const {
    params: { STOCK_ISDN_STATUS = [], STOCK_ISDN_TRANSFER_STATUS = [] },
  } = useConfigAppStore();

  const columns: ColumnsType = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render: (value, record, index) => (
        <Tooltip title={index + 1} placement="topLeft">
          <Text>{index + 1 + params.page * params.size}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Số',
      dataIndex: 'isdn',
      width: 180,
      align: 'left',
      fixed: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 180,
      align: 'left',
      render: (value) => {
        const text =
          STOCK_ISDN_STATUS.find((item: AnyElement) => item.value == value)
            ?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              type={TypeTagEnum.DEFAULT}
              color={STOCK_ISDN_STATUS_COLOR[value as TRANSFER_STATUS_ENUM]}
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
  ];
  const { filters } = useFilters();
  return (
    // <>
    //   <CTable
    //     rowKey="id"
    //     columns={columns}
    //     dataSource={searchData?.content || []}
    //     loading={isFetching}
    //     pagination={{
    //       total: searchData?.totalElements,
    //     }}
    //   />
    // </>
    <LayoutList
      filterItems={filters}
      data={(searchData as AnyElement) ?? []}
      columns={columns}
      title="Quản lý số"
      loading={isFetching}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập tên"
          placeholder="Nhập tên"
        />
      }
    />
  );
};
export default Body;
