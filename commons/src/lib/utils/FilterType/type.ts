import { AnyElement } from '@react/commons/types';
import { DatePickerProps, InputProps, SelectProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { ColumnType } from 'antd/es/table';
import { Key } from 'react';

export interface InputFilterTableType<T = AnyElement> extends InputProps {
  type: 'Input';
  placeholder?: string;
  name: string;
  onFilter: (name: string, value: T) => void;
  disabled?: boolean;
}

export interface SelectFilterTableType<T> extends SelectProps {
  type: 'Select';
  options: Array<{ label: string; value: string | number | null | AnyElement }>;
  placeholder?: string;
  name: string;
  onFilter: (name: string, value: T) => void;
  disabled?: boolean;
}

export interface DateFilterTableType<T> extends DatePickerProps {
  type: 'Date';
  name: string;
  onFilter: (name: string, value: T) => void;
  placeholder?: string;
  formatSubmit?: string;
  disabled?: boolean;
}

export interface DateRangeFilterTableType<T> extends RangePickerProps {
  type: 'DateRange';
  formatSubmit?: string;
  onFilter: (name: [string, string], value: [T, T]) => void;
  disabled?: boolean;
  placeholder: [string, string];
}

export type FilterTableProps<T> =
  | InputFilterTableType<T>
  | SelectFilterTableType<T>
  | DateFilterTableType<T>
  | DateRangeFilterTableType<T>;

// Định nghĩa interface FilterDropdownProps
export interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: Key[]) => void;
  selectedKeys: Key[];
  confirm: (param?: { closeDropdown?: boolean }) => void;
  clearFilters: () => void;
  close: () => void;
  filters?: Array<{ text: string; value: string }>;
  visible: boolean;
}

// Tạo type mới từ ColumnType chỉ lấy các thuộc tính liên quan đến filter
export type FilterColumnType<T = AnyElement> = Pick<
  ColumnType<T>,
  'filterDropdown' | 'filterIcon' | 'onFilter' | 'filterDropdownProps'
>;

export type FilterReturnType<T = AnyElement> = FilterColumnType<T>;

export type FilterStateType = Record<
  string,
  string | number | null | undefined | string[]
>;

export type FilterStateGenericType<T = string | number | null | undefined> =
  Record<string, T>;
