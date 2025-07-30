import { Button, Form, Popover, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { ChevronDown, ListFilterPlus, RotateCcw, Search } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { AnyElement } from '../../types';
import { CButton } from '../Button';
import { WrapperButton } from '../Template';
import {
  CheckboxRenderState,
  FormItemDate,
  FormItemDateRange,
  FormItemDebounceSearch,
  FormItemInput,
  FormItemSelect,
  SelectDateRangeFilter,
} from './components';
import { FilterPropsWithState } from './types';

export const CFilterState = memo(
  ({
    items = [],
    searchComponent,
    loading,
    actionComponentSub,
    stateValues,
    onChangeState,
  }: FilterPropsWithState) => {
    const [form] = Form.useForm();
    const [keyOpen, setKeyOpen] = useState<string[]>([]);

    const defaultValues = useMemo(() => {
      return items.reduce((acc, item) => {
        acc[item.name] = item.defaultValue;
        return acc;
      }, {} as Record<string, AnyElement>);
    }, [items]);

    useEffect(() => {
      if (items) {
        setKeyOpen(
          items.filter((item) => item.showDefault).map((item) => item.name)
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderItem = useMemo(() => {
      if (items.length === 0) return null;
      return items
        .filter((item) => keyOpen.includes(item.name))
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
    }, [keyOpen, items]);

    const handleSubmit = (values: Record<string, AnyElement>) => {
      const formattedValues = Object.entries(values).reduce(
        (acc, [key, value]) => {
          const filterItem = items.find((item) => item.name === key);
          if (filterItem && filterItem.type === 'Date' && value) {
            const dayjsValue = value.format(filterItem.formatSearch);
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
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, AnyElement>
      );
      onChangeState?.({
        ...formattedValues,
        page: '0',
        size: stateValues?.size,
        requestTime: dayjs().unix().toString(),
      });
    };

    const handleRefresh = () => {
      form.resetFields();
      form.submit();
      setKeyOpen(
        items.filter((item) => item.showDefault).map((item) => item.name)
      );
    };

    return (
      <Form
        form={form}
        onFinish={handleSubmit}
        disabled={loading}
        initialValues={defaultValues}
      >
        <WrapperButton>
          {items?.length > 0 && (
            <Popover
              content={
                <CheckboxRenderState
                  items={items}
                  keyOpen={keyOpen}
                  setKeyOpen={setKeyOpen}
                />
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
                size={18}
                className="cursor-pointer self-center"
                onClick={handleRefresh}
              />
            </Tooltip>
          </WrapperButton>
        </WrapperButton>
        <div className="mb-4 flex justify-start">{actionComponentSub}</div>
      </Form>
    );
  }
);
