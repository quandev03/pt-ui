import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { formatDate } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Form, Row, Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Body from '../components/Body';
import { useGetActionList } from '../hooks/useGetActionList';

const SubscriberImpactReportPage = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_SUBSCRIBER_IMPACT_REPORT
  );
  const validateDateRange = () => {
    const [start, end] = form.getFieldValue('rangePicker');
    const diffInDays = end.diff(start, 'days');
    if (diffInDays > 90) {
      return Promise.reject(
        new Error('Thời gian tìm kiếm không được vượt quá 90 ngày')
      );
    }
    return Promise.resolve();
  };
  const { data: actionTypes } = useGetActionList();
  const statusOptions = [
    {
      label: 'Đang xử lý',
      value: 1,
    },
    {
      label: 'Hoàn thành',
      value: 2,
    },
  ];
  const formOptions = [
    {
      label: 'Theo danh sách',
      value: '1',
    },
    {
      label: 'Theo file',
      value: '2',
    },
  ];
  const items: ItemFilter[] = [
    {
      label: 'Loại tác động',
      value: (
        <Form.Item label={''} name={'actionCode'} className="w-40">
          <CSelect
            options={actionTypes}
            placeholder="Loại tác động"
            fieldNames={{ label: 'name', value: 'code' }}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái thực hiện',
      value: (
        <Form.Item label={''} name={'status'} className="w-44">
          <CSelect options={statusOptions} placeholder="Trạng thái thực hiện" />
        </Form.Item>
      ),
    },
    {
      label: 'Hình thức thực hiện',
      value: (
        <Form.Item label={''} name={'form'} className="w-44">
          <CSelect options={formOptions} placeholder="Hình thức thực hiện" />
        </Form.Item>
      ),
    },
    {
      label: 'Ngày thực hiện',
      value: (
        <Form.Item
          label={''}
          name={'rangePicker'}
          rules={[{ validator: validateDateRange }]}
        >
          <CRangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            format={formatDate}
            allowClear={false}
          />
        </Form.Item>
      ),
    },
  ];
  useEffect(() => {
    if (!params.fromDate) {
      setSearchParams({
        fromDate: dayjs().subtract(29, 'day').format(formatDate),
        toDate: dayjs().format(formatDate),
        filters: '3',
      });
    }
  }, [params.fromDate]);
  useEffect(() => {
    if (params) {
      const { fromDate, toDate, ...rest } = params;
      form.setFieldsValue({
        ...rest,
        rangePicker: [dayjs(fromDate, formatDate), dayjs(toDate, formatDate)],
      });
    }
  }, [params]);
  const handleFinish = (values: any) => {
    const { rangePicker, ...rest } = values;
    const [fromDate, toDate] = rangePicker;
    handleSearch({
      ...rest,
      fromDate: fromDate.format(formatDate),
      toDate: toDate.format(formatDate),
    });
  };
  return (
    <div>
      <TitleHeader>
        Báo cáo tác động thuê bao theo file KH doanh nghiệp
      </TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleFinish}>
          <Row>
            <Col>
              <CFilter
                items={items}
                searchComponent={
                  <Tooltip
                    title="Nhập tên file/tên doanh nghiệp/số hợp đồng/người thực hiện"
                    placement="right"
                  >
                    <Form.Item label="" name="param">
                      <CInput
                        placeholder="Nhập điều kiện tìm kiếm"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                        maxLength={100}
                      />
                    </Form.Item>
                  </Tooltip>
                }
                validQuery={REACT_QUERY_KEYS.GET_SUBSCRIBER_IMPACT_REPORT}
              />
            </Col>
          </Row>
        </Form>
      </RowHeader>
      <Body actionTypes={actionTypes} />
    </div>
  );
};
export default SubscriberImpactReportPage;
