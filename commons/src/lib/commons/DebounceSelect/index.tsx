import { SelectProps } from 'antd';
import { debounce, filter as setFilter, uniqBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import CSelect from '../Select';

interface ValueBaseType {
  key?: string;
  label: React.ReactNode;
  value: string | number;
}
export interface DebounceSelectProps<ValueType>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions?: (search: any) => Promise<ValueType[]>;
  mode?: 'multiple' | 'tags';
  debounceTimeout?: number;
  getCurrentList?: any[];
  originOptions?: any[];
  filter?: { [key: string]: any };
}

const SelectApi = ({ setOptions, options = [], onSelect, ...props }: any) => {
  const [isFlag, setIsFlag] = useState<boolean>(true);
  const [defaultOptions, setDefaultOptions] = useState<ValueBaseType[]>([]);

  useEffect(() => {
    if (isFlag && options.length) {
      setDefaultOptions(options);
      setIsFlag(false);
    }
  }, [options]);
  const handleSelect = (...params: any) => {
    onSelect?.apply(null, params);
    if (defaultOptions.length > options.length) {
      setOptions(
        uniqBy(setFilter([...defaultOptions, ...options], 'value'), 'value')
      );
    }
  };
  return (
    <CSelect
      filterOption={() => true}
      {...props}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export function DebounceSelect<ValueType extends ValueBaseType>({
  fetchOptions,
  debounceTimeout = 800,
  mode,
  labelInValue = false,
  getCurrentList,
  originOptions = [],
  filter = undefined,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);

  useEffect(() => {
    loadOptions('');
  }, [JSON.stringify([...originOptions, filter])]);

  useEffect(() => {
    if (!getCurrentList) return;
    setOptions(getCurrentList);
  }, [getCurrentList]);
  const loadOptions = (value: string) => {
    setOptions([]);
    if (!fetchOptions) return;
    setFetching(true);
    fetchOptions(filter ? { keySearch: value, ...filter } : value)
      .then((newOptions) => {
        setOptions(
          uniqBy(setFilter([...newOptions, ...originOptions], 'value'), 'value')
        );
        setFetching(false);
      })
      .catch(() => setFetching(false));
  };

  const debounceFetcher = useMemo(() => {
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <SelectApi
      setOptions={setOptions}
      mode={mode}
      labelInValue={labelInValue}
      filterOption={() => true}
      onSearch={debounceFetcher}
      isLoading={fetching}
      {...props}
      options={options}
    />
  );
}
