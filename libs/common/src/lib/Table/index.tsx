import { TableProps } from 'antd';
import { RefObject, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from '../../utils';
import { useTableHeight } from '../../hooks';
import { TotalTableMessage } from '../TotalTableMessage';
import { StyledCommonTable } from './styles';

// Interface để type cho refs
interface TableRefs {
  heightTitleRef: RefObject<HTMLDivElement>;
  wrapperManagerRef: RefObject<HTMLDivElement>;
  filterManagerRef: RefObject<HTMLDivElement>;
}

interface CTableProps<T = unknown> extends TableProps<T> {
  refs?: TableRefs;
}

export function CTable<T = unknown>({
  pagination = false,
  refs,
  ...rest
}: CTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  // Sử dụng refs từ props hoặc tạo default refs
  const defaultHeightTitleRef = useRef<HTMLDivElement>(null);
  const defaultWrapperManagerRef = useRef<HTMLDivElement>(null);
  const defaultFilterManagerRef = useRef<HTMLDivElement>(null);

  const heightTitleRef = refs?.heightTitleRef || defaultHeightTitleRef;
  const wrapperManagerRef = refs?.wrapperManagerRef || defaultWrapperManagerRef;
  const filterManagerRef = refs?.filterManagerRef || defaultFilterManagerRef;

  // Sử dụng custom hook để tính toán chiều cao
  const { tableHeight } = useTableHeight({
    heightTitleRef,
    wrapperManagerRef,
    filterManagerRef,
    dataSource: rest.dataSource,
  });

  const handleChangePagination = (page: number, pageSize: number) => {
    setSearchParams({
      ...params,
      page: (page - 1).toString(),
      size: pageSize.toString(),
    });
  };

  return (
    <StyledCommonTable
      size="small"
      locale={{
        emptyText: 'Không có dữ liệu',
      }}
      scroll={{
        y: tableHeight > 0 ? tableHeight : undefined,
        x: 'max-content',
      }}
      {...rest}
      pagination={
        pagination
          ? {
              current: Number(params.page) + 1,
              pageSize: params.size,
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: [20, 50, 100],
              defaultPageSize: 20,
              onChange: pagination?.onChange ?? handleChangePagination,
              showTotal: TotalTableMessage,
              showQuickJumper: false,
              locale: {
                items_per_page: ' / trang',
                page: 'Trang',
              },
            }
          : false
      }
    />
  );
}

// export default memo(CTable) as typeof CTable;
