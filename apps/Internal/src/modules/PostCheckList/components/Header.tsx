import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader } from '@react/commons/Template/style';
import { Form, Tooltip } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from '@react/helpers/utils';
import dayjs from 'dayjs';
import { useEffect, useLayoutEffect } from 'react';
import { useGetCriteria } from 'apps/Internal/src/components/layouts/queryHooks';
import { DateFormat } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import useSearchHandler from '@react/hooks/useSearchHandler';

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const { data: criteriaOpt } = useGetCriteria();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_POST_CHECK_LIST
  );
  const items: ItemFilter[] = [
    {
      label: 'Tiêu chí',
      value: (
        <Form.Item name="criterions" className="min-w-28">
          <CSelect
            placeholder="Tiêu chí"
            options={criteriaOpt}
            mode="multiple"
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái hậu kiểm',
      value: (
        <Form.Item className="min-w-[160px]" name={'auditStatus'}>
          <CSelect
            placeholder="Trạng thái hậu kiểm"
            showSearch={false}
            allowClear={false}
            options={[
              {
                label: 'Đã hậu kiểm',
                value: '1',
              },
              {
                label: 'Chưa hậu kiểm',
                value: '0',
              },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item className="min-w-[160px]" name={'typeDate'}>
            <CSelect
              placeholder="Loại ngày"
              options={[
                { label: 'Ngày kích hoạt', value: '1' },
                { label: 'Ngày kiểm duyệt', value: '2' },
              ]}
              allowClear={false}
              showSearch={false}
            />
          </Form.Item>
          <Form.Item
            name={'rangePicker'}
            rules={[
              {
                validator: (_, value) => {
                  if (value) {
                    const toDate = dayjs(value[1]).subtract(29, 'day');
                    if (toDate.isAfter(value[0], 'D')) {
                      return Promise.reject(MESSAGE.G12);
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CRangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              allowClear={false}
            />
          </Form.Item>
        </>
      ),
      showDefault: true,
    },
  ];

  useLayoutEffect(() => {
    if (params.typeDate) {
      setSearchParams(params);
    } else {
      setSearchParams({
        filters: '2',
        typeDate: '1',
        fromDate: dayjs().subtract(29, 'day').format(DateFormat.DEFAULT),
        toDate: dayjs().format(DateFormat.DEFAULT),
      });
    }
  }, [params.typeDate]);

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        rangePicker: [
          params.fromDate
            ? dayjs(params.fromDate, DateFormat.DEFAULT)
            : dayjs().subtract(29, 'day'),
          params.toDate ? dayjs(params.toDate, DateFormat.DEFAULT) : dayjs(),
        ],
        criterions: params.criterions
          ? params.criterions.split(',')
          : undefined,
      });
    }
  }, [params]);

  const handleFinish = (values: any) => {
    const { rangePicker, criterions, ...rest } = values;
    handleSearch({
      ...rest,
      typeDate: values.typeDate ?? '1',
      criterions: criterions ? criterions.join(',') : undefined,
      fromDate: values.rangePicker
        ? dayjs(values.rangePicker[0]).format(DateFormat.DEFAULT)
        : dayjs().format(DateFormat.DEFAULT),
      toDate: values.rangePicker
        ? dayjs(values.rangePicker[1]).format(DateFormat.DEFAULT)
        : dayjs().format(DateFormat.DEFAULT),
      filters: params.filters ?? 2,
    });
  };

  return (
    <RowHeader>
      <Form form={form} onFinish={handleFinish}>
        <CFilter
          searchComponent={
            <Tooltip
              title="Nhập số thuê bao, tên đối tác/ đơn vị hoặc user kiểm duyệt"
              placement="topLeft"
            >
              <Form.Item name="searchText">
                <CInput
                  placeholder="Nhập số thuê bao, tên đối tác/ đơn vị hoặc user kiểm duyệt"
                  maxLength={100}
                />
              </Form.Item>
            </Tooltip>
          }
          items={items}
          validQuery={REACT_QUERY_KEYS.GET_LIST_POST_CHECK_LIST}
        />
      </Form>
    </RowHeader>
  );
};
