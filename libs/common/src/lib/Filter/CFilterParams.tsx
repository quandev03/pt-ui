import { Button, Form, Popover, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { ChevronDown, ListFilterPlus, RotateCcw, Search } from 'lucide-react';
import { memo, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDecodeParams } from '../../hooks';
import { AnyElement } from '../../types';
import { cleanParams } from '../../utils';
import { CButton } from '../Button';
import { WrapperButton } from '../Template';
import {
  CheckboxRender,
  FormItemDate,
  FormItemDateRange,
  FormItemDebounceSearch,
  FormItemInput,
  FormItemSelect,
  SelectDateRangeFilter,
} from './components';
import { BaseFilterProps, DateRangeFilterType } from './types';

export const CFilterParams = memo(
  ({
    items = [],
    searchComponent,
    loading,
    actionComponentSub,
  }: BaseFilterProps) => {
    const [form] = Form.useForm();
    const { pathname } = useLocation();
    const [, setSearchParams] = useSearchParams();
    const params = useDecodeParams();

    const defaultFilter = useMemo(() => {
      return items.reduce((result, item) => {
        if (item.showDefault) {
          result.push(item.name);
        }
        return result;
      }, [] as string[]);
    }, [items]);

    const handleRefresh = () => {
      const paramsDefault = items.reduce((result, item) => {
        if (
          item.defaultValue &&
          params.filters?.split(',').includes(item.name)
        ) {
          if (item.type === 'Date') {
            result[item.name] = dayjs(
              item.defaultValue,
              item.formatSearch
            ).format(item.formatSearch);
          } else if (item.type === 'DateRange' && item.defaultValue) {
            result[item.name] = item.defaultValue.map((i) =>
              dayjs(i, item.formatSearch).format(item.formatSearch)
            );
          } else {
            result[item.name] = item.defaultValue;
          }
        }
        return result;
      }, {} as Record<string, string | string[]>);
      const newParams = {
        filters: defaultFilter.join(','),
        page: '0',
        size: '20',
        status: '',
        ...paramsDefault,
        requestTime: dayjs().unix().toString(),
      };
      setSearchParams(newParams, { replace: true });
      form.resetFields();
    };

    const formValuesDefault = useMemo(() => {
      return items.reduce((result, item) => {
        if (
          item.defaultValue &&
          params.filters?.split(',').includes(item.name)
        ) {
          result[item.name] = item.defaultValue;
        }
        return result;
      }, {} as Record<string, string>);
    }, [items, params.filters]);

    const spreadItems = useMemo(() => {
      return items.map((item) => {
        if (item.type === 'SelectDateRange') {
          return item.dateRange as DateRangeFilterType;
        }
        return item;
      });
    }, [items]);

    const handleSubmit = (values: Record<string, AnyElement>) => {
      const formattedValues = Object.entries(values).reduce(
        (acc, [key, value]) => {
          const filterItem = spreadItems.find((item) => item.name === key);
          if (filterItem && filterItem.type === 'Date' && value) {
            const dayjsValue = dayjs(value).format(filterItem.formatSearch);
            acc[key] = dayjsValue;
          } else if (
            filterItem &&
            filterItem.type === 'DateRange' &&
            value &&
            Array.isArray(value)
          ) {
            const rangeDateFormatted: string[] = [];
            filterItem.keySearch.forEach((item, index) => {
              let formatDate = value[index].format(filterItem.formatSearch);
              if (index === 0) {
                formatDate = value[index]
                  .startOf('day')
                  .format(filterItem.formatSearch);
              } else {
                formatDate = value[index]
                  .endOf('day')
                  .format(filterItem.formatSearch);
              }
              acc[item] = formatDate;
              rangeDateFormatted.push(formatDate);
            });
            acc[key] = rangeDateFormatted.join(',');
          } else if (value && Array.isArray(value)) {
            acc[key] = value.join(',');
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, AnyElement>
      );
      setSearchParams(
        {
          ...formattedValues,
          page: '0',
          size: params.size,
          filters: params.filters,
          requestTime: dayjs().unix().toString(),
        },
        {
          replace: true,
        }
      );
    };

    useEffect(() => {
      const filters = params.filters || '';
      const paramsDefault = items.reduce((result, item) => {
        if (item.defaultValue) {
          if (item.type === 'Date') {
            result[item.name] = dayjs(
              item.defaultValue,
              item.formatSearch
            ).format(item.formatSearch);
          } else if (
            item.type === 'DateRange' &&
            item.defaultValue &&
            Array.isArray(item.defaultValue)
          ) {
            item.defaultValue.forEach((i, index) => {
              if (i) {
                if (index === 0) {
                  result[item.keySearch[index]] = i
                    .startOf('day')
                    .format(item.formatSearch);
                } else {
                  result[item.keySearch[index]] = i
                    .endOf('day')
                    .format(item.formatSearch);
                }
              }
            });
            result[item.name] = item.defaultValue.join(',');
          } else {
            result[item.name] = item.defaultValue;
          }
        }
        return result;
      }, {} as Record<string, string>);
      setSearchParams(
        {
          ...paramsDefault,
          ...params,
          filters: filters ? filters : defaultFilter.join(','),
          requestTime: params.requestTime
            ? params.requestTime
            : dayjs().unix().toString(),
        },
        { replace: true }
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
      const newFormValue = cleanParams<Record<string, AnyElement>>(params);
      const processedFormValue = Object.entries(newFormValue).reduce(
        (acc, [key, value]) => {
          const filterItem = spreadItems.find((item) => item.name === key);
          if (filterItem && filterItem.type === 'Date' && value) {
            const dayjsValue = dayjs(value, filterItem.formatSearch);
            acc[key] = dayjsValue;
          } else if (
            filterItem &&
            filterItem.type === 'DateRange' &&
            params[key] &&
            value
          ) {
            const splitValue: string[] = value.split(',');
            if (splitValue.length === 2) {
              acc[key] = splitValue.map((item: string) =>
                dayjs(item, filterItem.formatSearch)
              );
            }
          } else if (filterItem && filterItem.type === 'Select' && value) {
            acc[key] = value.split(',');
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, AnyElement>
      );
      form.setFieldsValue(processedFormValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, params]);

    const currentFilters: string[] = useMemo(() => {
      const filtersParam = params.filters;
      if (!filtersParam) return [];
      if (Array.isArray(filtersParam)) return filtersParam;
      return filtersParam.split(',').filter(Boolean);
    }, [params.filters]);

    const renderItem = useMemo(() => {
      if (items.length === 0) return null;
      return items
        .filter((item) => currentFilters.includes(item.name))
        .map((item, index) => {
          switch (item.type) {
            case 'Input':
              return <FormItemInput key={item.name + index} {...item} />;
            case 'Select':
              return <FormItemSelect key={item.name + index} {...item} />;
            case 'Date':
              return <FormItemDate key={item.name + index} {...item} />;
            case 'DateRange':
              return <FormItemDateRange key={item.name + index} {...item} />;
            case 'SelectDateRange':
              return (
                <SelectDateRangeFilter key={item.name + index} {...item} />
              );
            case 'DebounceSearch':
              return (
                <FormItemDebounceSearch key={item.name + index} {...item} />
              );
            default:
              return null;
          }
        });
    }, [currentFilters, items]);

    return (
      <Form
        form={form}
        onFinish={handleSubmit}
        disabled={loading}
        initialValues={formValuesDefault}
      >
        <WrapperButton>
          {items?.length > 0 && (
            <Popover
              content={
                <CheckboxRender items={items} defaultFilter={defaultFilter} />
              }
              placement="bottom"
              trigger="click"
            >
              <Button type="default">
                <Space>
                  <ListFilterPlus size={16} />
                  Bộ lọc
                  <ChevronDown size={16} />
                </Space>
              </Button>
            </Popover>
          )}
          {searchComponent}
          {renderItem}
          <WrapperButton>
            <CButton icon={<Search size={16} />} htmlType="submit">
              Tìm kiếm
            </CButton>
            <Tooltip title="Làm mới">
              <RotateCcw
                className="cursor-pointer self-center"
                onClick={handleRefresh}
              />
            </Tooltip>
          </WrapperButton>
        </WrapperButton>
        <div className="mt-4 flex justify-start">{actionComponentSub}</div>
      </Form>
    );
  }
);
