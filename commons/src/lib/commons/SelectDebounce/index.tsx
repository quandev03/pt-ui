import type { SelectProps } from 'antd';
import { Select } from 'antd';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnyElement } from '../types';

interface DebounceSelectProps<T = AnyElement>
  extends Omit<SelectProps<T>, 'options'> {
  fetchOptions: (search: string) => Promise<T[]>;
  debounceTimeout?: number;
  defaultSearch?: string;
}

const SelectDebounce = <
  T extends { label: string; value: string | number } = AnyElement
>({
  fetchOptions,
  debounceTimeout = 300,
  defaultSearch,
  ...props
}: DebounceSelectProps<T>) => {
  const [options, setOptions] = useState<T[]>([]);
  const [fetching, setFetching] = useState(false);

  const debounceFetcher = useRef(
    debounce(async (value: string) => {
      setFetching(true);
      const data = await fetchOptions(value);
      setOptions(data);
      setFetching(false);
    }, debounceTimeout)
  ).current;

  useEffect(() => {
    const fetchInitialOptions = async () => {
      setFetching(true);
      const initialOptions = await fetchOptions(defaultSearch ?? '');
      setOptions(initialOptions);
      setFetching(false);
    };
    fetchInitialOptions();
  }, [fetchOptions]);

  const handleSearch = useCallback(
    (value: string) => {
      debounceFetcher(value);
    },
    [debounceFetcher]
  );

  return (
    <Select
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      options={options}
      loading={fetching}
      {...props}
    />
  );
};

export default SelectDebounce;
