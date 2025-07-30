import { DatePickerProps, FormItemProps, InputProps, SelectProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { AnyElement, IPage, IOption } from '../../types';

export interface InputFilterType extends InputProps {
  type: 'Input';
  name: string;
  label: string;
  showDefault?: boolean;
  propsFormItem?: FormItemProps;
  stateKey?: string;
  tooltip?: string;
}

export interface SelectFilterType extends SelectProps {
  type: 'Select';
  name: string;
  label: string;
  showDefault?: boolean;
  propsFormItem?: FormItemProps;
  stateKey?: string;
}

export interface DateFilterType extends DatePickerProps {
  type: 'Date';
  name: string;
  label: string;
  formatSearch: string;
  showDefault?: boolean;
  propsFormItem?: FormItemProps;
  stateKey?: string;
}

export interface DateRangeFilterType extends RangePickerProps {
  type: 'DateRange';
  name: string;
  label: string;
  keySearch: [string, string];
  formatSearch: string;
  showDefault?: boolean;
  propsFormItem?: FormItemProps;
  disabled?: boolean;
  stateKey?: string;
  disabledFutureDate?: boolean;
}

export interface SelectDateRangeFilterType {
  type: 'SelectDateRange';
  name: string;
  label: string;
  defaultValue?: string;
  showDefault?: boolean;
  dateRange: DateRangeFilterType;
  select: SelectFilterType;
  disabled?: boolean;
  stateKey?: string;
}

export interface DebounceSearchFilterType<T = Record<string, unknown>> {
  type: 'DebounceSearch';
  name: string;
  label: string;
  showDefault?: boolean;
  propsFormItem?: FormItemProps;
  stateKey?: string;
  defaultValue?: string; // Add defaultValue to match other filter types
  searchFn: (params: {
    searchTerm: string;
    page?: number;
    size?: number;
  }) => Promise<IPage<T>>;
  debounceDelay?: number;
  minSearchLength?: number;
  transformData?: (data: T[]) => IOption[];
  onSearchError?: (error: Error) => void;
  defaultOptions?: IOption[];
  placeholder?: string;
  enableLoadMore?: boolean;
  pageSize?: number;
  allowClear?: boolean;
  disabled?: boolean;
}

export type FilterItemProps =
  | InputFilterType
  | SelectFilterType
  | DateFilterType
  | DateRangeFilterType
  | SelectDateRangeFilterType
  | DebounceSearchFilterType;

export interface BaseFilterProps {
  loading?: boolean;
  items?: FilterItemProps[];
  defaultShow?: string[];
  searchComponent?: React.ReactNode;
  placeholderSearch?: string;
  actionComponentSub?: React.ReactNode;
  stateValues?: Record<string, AnyElement>;
  onChangeState?: (values: Record<string, AnyElement>) => void;
}

export interface FilterPropsWithState extends BaseFilterProps {
  stateValues: Record<string, AnyElement>;
  onChangeState: (values: Record<string, AnyElement>) => void;
}

export type FilterProps = FilterPropsWithState | BaseFilterProps;
