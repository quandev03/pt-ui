import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { formatDate } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Row, Select } from 'antd';
import { useGetCriteria } from 'apps/Internal/src/components/layouts/queryHooks';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useEffect, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApproveStatusList } from '../hooks/useApproveStatusList';
import useCensorshipStore from '../store';
import { CENSORSHIPSTT } from '../types';
import { DateFormat } from '@react/constants/app';

const Header = () => {
  const { isAdmin, setIsClickSearch } = useCensorshipStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const { data: criteriaOpt } = useGetCriteria();
  const queryKey = isAdmin
    ? REACT_QUERY_KEYS.GET_CENSORSHIP_LIST
    : REACT_QUERY_KEYS.GET_CENSORSHIP_LIST_FOR_STAFF;
  const { handleSearch } = useSearchHandler(queryKey);
  const typeOptions = [
    { label: 'Ngày kích hoạt', value: '1' },
    { label: 'Ngày cập nhật', value: '2' },
  ];
  const { data: approvalSttOpts } = useApproveStatusList('APPROVAL_STATUS');
  useLayoutEffect(() => {
    if (!params.type) {
      setSearchParams({
        filters: isAdmin ? '3' : '2',
        type: '1',
        fromDate: dayjs().subtract(30, 'day').format(DateFormat.DEFAULT),
        toDate: dayjs().format(DateFormat.DEFAULT),
      });
      setIsClickSearch(Math.random());
    }
  }, [params.type]);
  useEffect(() => {
    if (params) {
      const { fromDate, toDate, approveStatus, ...rest } = params;
      const from = fromDate ? dayjs(fromDate, formatDate) : dayjs();
      const to = toDate ? dayjs(toDate, formatDate) : dayjs();
      const criteria = rest.criteria ? rest.criteria.split(',') : undefined;
      form.setFieldsValue({
        ...rest,
        approveStatus: approveStatus && +approveStatus,
        rangePicker: [from, to],
        criteria: criteria,
      });
    }
  }, [params]);
  const validateDateRange = () => {
    const [start, end] = form.getFieldValue('rangePicker');
    const diffInDays = end.diff(start, 'days');
    if (diffInDays > 30) {
      return Promise.reject(
        new Error('Thời gian tìm kiếm không được vượt quá 30 ngày')
      );
    }
    return Promise.resolve();
  };
  const items: ItemFilter[] = [
    {
      label: 'Trạng thái kiểm duyệt',
      value: (
        <Form.Item name={'approveStatus'}>
          <CSelect
            placeholder="Trạng thái kiểm duyệt"
            options={
              isAdmin
                ? approvalSttOpts
                : approvalSttOpts?.filter(
                    (item) => item.value !== CENSORSHIPSTT.Approved
                  )
            }
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    ...(isAdmin
      ? [
          {
            label: 'Trạng thái phân công',
            value: (
              <Form.Item name={'assignStatus'}>
                <CSelect
                  placeholder="Trạng thái phân công"
                  options={[
                    {
                      label: 'Đã phân công',
                      value: '1',
                    },
                    { label: 'Chưa phân công', value: '0' },
                  ]}
                  showSearch={false}
                />
              </Form.Item>
            ),
          },
        ]
      : []),
    {
      label: 'Tiêu chí',
      value: (
        <Form.Item name={'criteria'} className="min-w-28">
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
      label: 'Loại ngày',
      value: (
        <>
          {isAdmin && (
            <Form.Item name={'type'}>
              <Select
                placeholder="Loại ngày"
                options={typeOptions}
                allowClear={false}
              />
            </Form.Item>
          )}
          <Form.Item
            name={'rangePicker'}
            rules={[{ validator: validateDateRange }]}
          >
            <CRangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format={formatDate}
              allowClear={false}
            />
          </Form.Item>
        </>
      ),
      showDefault: true,
    },
  ];
  const defaultFilters = isAdmin ? 3 : 2;
  const handleFinish = (values: any) => {
    const { rangePicker, type, ...rest } = values;
    const [fromDate, toDate] = rangePicker || [dayjs(), dayjs()];
    const newType = type ?? '1';
    const filters = params.filters ?? defaultFilters;
    handleSearch({
      ...params,
      ...rest,
      type: newType,
      fromDate: fromDate.format(formatDate),
      toDate: toDate.format(formatDate),
      page: 0,
      size: 10000,
      filters,
      criteria: rest.criteria ? rest.criteria.join(',') : undefined,
    });
    setIsClickSearch(Math.random());
  };

  return (
    <>
      <TitleHeader>
        {isAdmin ? 'Danh sách phân công kiểm duyệt' : 'Danh sách kiểm duyệt'}
      </TitleHeader>
      <RowHeader className="!mb-0">
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          initialValues={{ type: 1 }}
        >
          <Row gutter={[8, 16]}>
            <CFilter
              searchComponent={
                <Form.Item name={'searchText'} label={''} className="w-80">
                  <CInput
                    placeholder={
                      isAdmin
                        ? 'Nhập số thuê bao hoặc user kiểm duyệt'
                        : 'Nhập số thuê bao, tên đối tác/đơn vị'
                    }
                    maxLength={50}
                  />
                </Form.Item>
              }
              items={items}
              validQuery={queryKey}
            />
          </Row>
        </Form>
      </RowHeader>
    </>
  );
};
export default Header;
