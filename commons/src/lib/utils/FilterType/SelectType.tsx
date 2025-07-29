import { FilterReturnType, SelectFilterTableType } from './type';
import CSelect from '@react/commons/Select';
import { AnyElement } from '@react/commons/types';
import { SearchOutlined } from '@ant-design/icons';

export const getSelectFilter = (
  props: SelectFilterTableType<AnyElement>,
): FilterReturnType => {
  const {
    disabled = false,
    options,
    defaultValue,
    name,
    placeholder,
    onFilter,
    mode,
    ...rest
  } = props;

  const isMultiple = mode === 'multiple';

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      // Initialize selectedKeys based on defaultValue if not already set
      if (selectedKeys.length === 0 && defaultValue) {
        const initialKeys = isMultiple
          ? Array.isArray(defaultValue)
            ? defaultValue
            : [defaultValue]
          : Array.isArray(defaultValue)
            ? [defaultValue[0]]
            : [defaultValue];
        setSelectedKeys(initialKeys);
      }

      return (
        <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
          <CSelect
            placeholder={placeholder || `Chọn ${name}`}
            value={isMultiple ? selectedKeys : selectedKeys[0]}
            onChange={(value: AnyElement) => {
              const newKeys =
                value !== undefined && value !== null
                  ? Array.isArray(value)
                    ? value
                    : [value]
                  : [];
              setSelectedKeys(newKeys);

              // For single mode or when value is not array, use onChange
              if (!isMultiple || !Array.isArray(value)) {
                setTimeout(() => {
                  confirm();
                  if (isMultiple) {
                    onFilter(name, newKeys.length > 0 ? newKeys : null);
                  } else {
                    onFilter(name, newKeys.length > 0 ? newKeys[0] : null);
                  }
                }, 0);
              }
            }}
            onDeselect={(deselectedValue: AnyElement) => {
              if (isMultiple) {
                const newKeys = selectedKeys.filter(
                  key => key !== deselectedValue,
                );
                setSelectedKeys(newKeys);
                setTimeout(() => {
                  confirm();
                  onFilter(name, newKeys.length > 0 ? newKeys : null);
                }, 0);
              }
            }}
            onSelect={(selectedValue: AnyElement) => {
              if (isMultiple && !selectedKeys.includes(selectedValue)) {
                const newKeys = [...selectedKeys, selectedValue];
                setSelectedKeys(newKeys);
                setTimeout(() => {
                  confirm();
                  onFilter(name, newKeys);
                }, 0);
              }
            }}
            defaultValue={
              defaultValue
                ? isMultiple
                  ? Array.isArray(defaultValue)
                    ? defaultValue
                    : [defaultValue]
                  : defaultValue
                : null
            }
            style={{ width: 200, marginBottom: 8, display: 'block' }}
            options={options}
            allowClear
            onClear={() => {
              setSelectedKeys([]);
              setTimeout(() => {
                clearFilters?.();
                confirm();
                onFilter(name, null);
              }, 0);
            }}
            disabled={disabled}
            mode={mode}
            {...rest}
          />
        </div>
      );
    },
    filterIcon: filtered => (
      <SearchOutlined
        size={16}
        className="cursor-pointer"
        style={{
          color: filtered || defaultValue ? "blue" : "silver",
        }}
      />
    ),
    onFilter: (value, record) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const recordValue = record[name];

      // Handle multiple mode
      if (isMultiple && Array.isArray(value)) {
        return value.includes(recordValue);
      }

      // Handle single mode
      return recordValue === value;
    },
  };
};
