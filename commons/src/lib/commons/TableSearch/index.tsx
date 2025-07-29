import { useRef, useState, Key, useEffect, useCallback } from 'react';
import { Input, InputRef, Spin } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  ColumnGroupType,
  ColumnType,
  TablePaginationConfig,
  TableProps,
} from 'antd/es/table';
import CTable from '../Table';
import { cleanUpString } from '@react/helpers/utils';
import { TotalTableMessage } from '../Template/TotalTableMessage';

export interface ExtendedColumnType<T> extends ColumnType<T> {
  searchDisiable?: boolean;
  values?: (value: any) => string;
}
export type ExtendedColumnsType<T> = (
  | ExtendedColumnType<T>
  | ColumnGroupType<T>
)[];
type CommonSearchTableProps<T> = TableProps<T> & {
  columns: ExtendedColumnType<T>[];
  dataSource: T[];
  pagination: {
    total: number;
    current: number;
    pageSize: number;
    totalElements: number;
  };
  onChange: (pagination: TablePaginationConfig) => void;
};

const CTableSearch = <T extends object>({
  columns: initialColumns,
  dataSource,
  pagination,
  onChange,
  ...rest
}: CommonSearchTableProps<T>) => {
  const { pageSize, current, totalElements } = pagination;
  const searchInput = useRef<InputRef>(null);
  const [filteredTotal, setFilteredTotal] = useState<number>(totalElements);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback(
    (
      searchValue: string,
      dataIndex: string,
      confirm?: ({ closeDropdown }: { closeDropdown: boolean }) => void
    ) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // If search value is empty, reset immediately without debounce
      if (!searchValue || searchValue.trim() === '') {
        setIsSearching(false);
        setFilteredTotal(totalElements);
        setSearchValues((prev) => ({ ...prev, [dataIndex]: '' }));
        setIsLoading(false);
        if (confirm) {
          confirm({ closeDropdown: false });
        }
        return;
      }

      setIsLoading(true);

      debounceTimeoutRef.current = setTimeout(() => {
        const hasSearchValue = searchValue.trim() !== '';
        setIsSearching(hasSearchValue);

        if (!hasSearchValue) {
          setFilteredTotal(totalElements);
          setSearchValues((prev) => ({ ...prev, [dataIndex]: '' }));
        } else {
          setSearchValues((prev) => ({ ...prev, [dataIndex]: searchValue }));
          // Calculate filtered total for this column
          const matchCount = dataSource.filter((item) => {
            const col = initialColumns.find(
              (c) => 'dataIndex' in c && c.dataIndex === dataIndex
            ) as ExtendedColumnType<T> | undefined;
            if (!col || !('dataIndex' in col)) return false;

            const itemValue = col.values
              ? col.values(item[col.dataIndex as keyof T])
              : item[col.dataIndex as keyof T];
            const trimmedItemValue =
              itemValue && typeof itemValue === 'string'
                ? itemValue.trim()
                : itemValue;

            return (
              trimmedItemValue &&
              trimmedItemValue
                .toString()
                .toLowerCase()
                .includes(searchValue.toLowerCase().trim())
            );
          }).length;

          setFilteredTotal(matchCount);
        }

        setIsLoading(false);
        if (confirm) {
          confirm({ closeDropdown: false });
        }
      }, 300); // 300ms debounce delay
    },
    [dataSource, totalElements, initialColumns]
  );

  const handleSearch = (
    selectedKeys: string[],
    confirm: ({ closeDropdown }: { closeDropdown: boolean }) => void,
    dataIndex: string
  ) => {
    const searchValue = selectedKeys.length > 0 ? selectedKeys[0] : '';
    debouncedSearch(searchValue, dataIndex, confirm);
  };

  const getColumnSearchProps = (col: ExtendedColumnType<T>): ColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Nhập giá trị tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedKeys(value ? [value] : []);
            if (!value) {
              setIsSearching(false);
              setFilteredTotal(totalElements);
            }
            handleSearch(
              value ? [value] : [],
              confirm,
              col.dataIndex as string
            );
          }}
          onBlur={(e) => {
            const cleanedValue = selectedKeys[0]
              ? selectedKeys[0].toString().trim()
              : '';
            setSelectedKeys(cleanedValue ? [cleanedValue] : []);
            if (!cleanedValue) {
              setIsSearching(false);
              setFilteredTotal(totalElements);
            }
            handleSearch([cleanedValue], confirm, col.dataIndex as string);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: string | number | boolean | Key, record: T) => {
      // If no search value, show all records
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return true;
      }

      const recordValue = col.values
        ? col.values(record[col.dataIndex as keyof T])
        : record[col.dataIndex as keyof T];
      const trimmedValue =
        recordValue && typeof recordValue === 'string'
          ? recordValue.trim()
          : recordValue;

      return trimmedValue
        ? trimmedValue
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase().trim())
        : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.current?.focus();
        }, 100);
      }
      if (!visible && !searchInput.current?.input?.value) {
        setIsSearching(false);
        setFilteredTotal(totalElements);
        setIsLoading(false);
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      }
    },
    render: col.render,
  });

  const columns = initialColumns.map((col: ExtendedColumnType<T>) => {
    return {
      ...col,
      ...(!col.searchDisiable ? getColumnSearchProps(col) : {}),
    };
  });

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <CTable
      columns={columns}
      dataSource={dataSource}
      onChange={onChange}
      loading={isLoading}
      pagination={
        !dataSource
          ? false
          : {
              current: current,
              pageSize: pageSize,
              total: isSearching ? filteredTotal : totalElements,
              showTotal: () =>
                isSearching
                  ? TotalTableMessage(filteredTotal)
                  : TotalTableMessage(totalElements),
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange: () => {},
            }
      }
      {...rest}
    />
  );
};

export default CTableSearch;
