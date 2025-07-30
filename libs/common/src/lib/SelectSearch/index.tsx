import { useInfiniteQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { useCallback, useState } from 'react';
import { CSelect } from '../Select';
import { IOption, IPage } from '../../types';
import { useDebounce } from '../../hooks';

interface CSelectSearchProps<T = Record<string, unknown>>
  extends Omit<SelectProps, 'options' | 'loading'> {
  searchFn: (params: {
    searchTerm: string;
    page?: number;
    size?: number;
  }) => Promise<IPage<T>>;
  searchKey?: string;
  debounceDelay?: number;
  minSearchLength?: number;
  transformData?: (data: T[]) => IOption[];
  onSearchError?: (error: Error) => void;
  defaultOptions?: IOption[];
  placeholder?: string;
  enableLoadMore?: boolean;
  pageSize?: number;
}

export const CSelectSearch = <T = Record<string, unknown>,>({
  searchFn,
  searchKey = 'searchTerm',
  debounceDelay = 500,
  minSearchLength = 0,
  transformData,
  onSearchError,
  defaultOptions = [],
  placeholder = 'Nhập để tìm kiếm...',
  onSearch: onSearchProp,
  enableLoadMore = true,
  pageSize = 20,
  ...selectProps
}: CSelectSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  const {
    data: options = [],
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['selectSearch', debouncedSearchTerm, searchKey],
    queryFn: ({ pageParam = 0 }) => {
      return searchFn({
        searchTerm: debouncedSearchTerm,
        page: pageParam,
        size: pageSize,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last || !lastPage.content || lastPage.content.length === 0) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    enabled: debouncedSearchTerm.length >= minSearchLength,
    refetchOnWindowFocus: false,
    initialPageParam: 0,
    select: (data) => {
      if (!data?.pages) {
        return defaultOptions;
      }
      const allItems: T[] = data.pages.flatMap((page) => page.content);
      if (transformData) {
        return transformData(allItems);
      }
      return allItems.map((item) => {
        const itemRecord = item as Record<string, unknown>;
        const value = itemRecord.value || itemRecord.id;
        return {
          label: String(
            itemRecord.label ||
              itemRecord.name ||
              itemRecord.fullname ||
              itemRecord.title ||
              itemRecord.id ||
              ''
          ),
          value:
            typeof value === 'string' || typeof value === 'number'
              ? value
              : String(value),
        };
      });
    },
  });

  const { debouncedCallback: debouncedSearch } = useDebounce(
    (value: string) => {
      setDebouncedSearchTerm(value);
    },
    debounceDelay
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (onSearchProp) {
        onSearchProp(value);
      }

      if (value && value.length >= minSearchLength) {
        debouncedSearch(value);
      } else {
        setDebouncedSearchTerm('');
      }
    },
    [debouncedSearch, onSearchProp, minSearchLength]
  );

  if (error && onSearchError) {
    onSearchError(error as Error);
  }

  return (
    <CSelect
      {...selectProps}
      showSearch
      placeholder={placeholder}
      options={options || defaultOptions}
      isLoading={isLoading || isFetching}
      onSearch={handleSearch}
      filterOption={false}
      notFoundContent={
        isLoading || isFetching
          ? 'Đang tìm kiếm...'
          : searchTerm && searchTerm.length < minSearchLength
          ? `Nhập ít nhất ${minSearchLength} ký tự để tìm kiếm`
          : searchTerm &&
            searchTerm.length >= minSearchLength &&
            options.length === 0
          ? 'Không tìm thấy kết quả'
          : 'Nhập để tìm kiếm'
      }
      onPopupScroll={
        enableLoadMore && hasNextPage && !isFetchingNextPage
          ? (e) => {
              const target = e.target as HTMLElement;
              if (
                target.scrollTop + target.offsetHeight ===
                target.scrollHeight
              ) {
                fetchNextPage();
              }
            }
          : undefined
      }
    />
  );
};
