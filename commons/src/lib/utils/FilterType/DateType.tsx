import { FilterOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { DateFilterTableType, FilterReturnType } from './type';
import { AnyElement } from '@react/commons/types';
import CDatePicker from '@react/commons/DatePicker';
import { formatDate } from '@react/constants/moment';

export const getDateFilter = (
  props: DateFilterTableType<AnyElement>,
): FilterReturnType => {
  const {
    name,
    defaultValue,
    disabled = false,
    placeholder,
    onFilter,
    formatSubmit,
  } = props;
  const submit = (value: string) => {
    onFilter(name, value);
  };
  return {
    filterDropdown: ({ confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <CDatePicker
          placeholder={placeholder as string | undefined}
          onChange={(value: Dayjs) => {
            confirm();
            submit(value ? value.format(formatSubmit || formatDate) : '');
          }}
          defaultValue={
            defaultValue
              ? dayjs(defaultValue, formatSubmit || formatDate)
              : undefined
          }
          style={{ width: 200, marginBottom: 8, display: 'block' }}
          allowClear
          disabled={disabled}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered || defaultValue ? "blue" : "silver",
        }}
      />
    ),
    onFilter: (value, record) => {
      if (value === null || value === undefined || value === '') {
        return false;
      }
      return record[name] === value;
    },
    filterDropdownProps: {
      onOpenChange: () => {},
    },
  };
};
