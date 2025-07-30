import { Form, Tooltip } from 'antd';
import { DebounceSearchFilterType } from '../types';
import { CSelectSearch } from '../../SelectSearch';

export const FormItemDebounceSearch = <T = Record<string, unknown>,>({
  name,
  propsFormItem = {},
  stateKey,
  label,
  defaultValue,
  searchFn,
  debounceDelay = 500,
  minSearchLength = 2,
  transformData,
  onSearchError,
  defaultOptions = [],
  placeholder,
  enableLoadMore = true,
  pageSize = 20,
  allowClear = true,
  disabled = false,
}: DebounceSearchFilterType<T>) => {
  return (
    <Tooltip title={label}>
      <Form.Item
        name={stateKey ? stateKey : name}
        className="w-48"
        {...propsFormItem}
      >
        <CSelectSearch<T>
          searchFn={searchFn}
          debounceDelay={debounceDelay}
          minSearchLength={minSearchLength}
          transformData={transformData}
          onSearchError={onSearchError}
          defaultOptions={defaultOptions}
          placeholder={
            placeholder || defaultValue || `Chọn ${label.toLowerCase()}...`
          }
          enableLoadMore={enableLoadMore}
          pageSize={pageSize}
          allowClear={allowClear}
          disabled={disabled}
          style={{ width: '100%' }}
        />
      </Form.Item>
    </Tooltip>
  );
};
