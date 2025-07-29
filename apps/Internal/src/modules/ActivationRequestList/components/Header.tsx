import {
  RowHeader,
} from '@react/commons/Template/style';
import { Form, Row, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useListApproveStatus } from '../queryHook/useList';
import { useEffect } from 'react';
import CInput from '@react/commons/Input';
import { decodeSearchParams } from '@react/helpers/utils';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { formatDate } from '@react/constants/moment';
import dayjs from 'dayjs';
import { CRangePicker } from '@react/commons/DatePicker';

const Body: React.FC = () => {
  const [searchParams] = useSearchParams();
  const form = Form.useFormInstance();
  const params = decodeSearchParams(searchParams);
  const { data: dataApproveStatus } = useListApproveStatus();
  const approveStatusOptions = dataApproveStatus?.map((status: any) => ({
    label: status.value,
    value: parseInt(status.code),
  }));

  useEffect(() => {
    form.submit();
  }, [params.type]);

  useEffect(() => {
    if (params) {
      const { fromDate, toDate, number, status, ...rest } = params;
      const from = fromDate ? dayjs(fromDate, formatDate) : dayjs().subtract(29, 'day');
      const to = toDate ? dayjs(toDate, formatDate) : dayjs();
      const stt = status !== '' ? status : undefined;
      form.setFieldsValue({
        ...rest,
        status: stt,
        rangePicker: [from, to],
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

  const typeOptions = [
    { label: 'Ngày tạo yêu cầu', value: '1' },
    { label: 'Ngày sinh', value: '2' },
  ];

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái tiền kiểm',
      value: (
        <Form.Item name={'status'} className="w-48">
          <CSelect
            placeholder="Trạng thái tiền kiểm"
            options={approveStatusOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item name={'type'} className="w-40">
            <Select
              placeholder="Loại ngày"
              options={typeOptions}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item name={'rangePicker'} rules={[{ validator: validateDateRange }]}>
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

  return (
    <div>
      <RowHeader>
        <Row gutter={[8, 16]}>
          <Form.Item label="" name="listIds" hidden />
          <CFilter
            items={items}
            searchComponent={
              <Form.Item name={'number'}>
                <CInput
                  placeholder="Nhập số thuê bao"
                  maxLength={11}
                  onlyNumber
                />
              </Form.Item>
            }
          />
        </Row>
      </RowHeader>
    </div>
  );
};

export default Body;
