import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter, RowHeader } from '@react/commons/Template/style';
import { Col, Form, Row } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeSearchParams } from '@react/helpers/utils';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { DateFormat } from '@react/constants/app';
import Select from '@react/commons/Select';
import { formatDate } from '@react/constants/moment';
import CButton from '@react/commons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import useStoreBusinessManagement from '../store';

export const statusOptions = [
  {
    label: 'Đang hoạt động',
    value: 1,
  },
  {
    label: 'Dừng hoạt động',
    value: 0,
  },
];

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { positionCode } = useStoreBusinessManagement();

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
    { label: 'Ngày tạo', value: '1' },
    { label: 'Ngày cập nhật', value: '2' },
  ];

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái DN',
      value: (
        <Form.Item name="status" className="min-w-[160px]">
          <CSelect
            placeholder="Trạng thái DN"
            options={statusOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },

    {
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item name="dateType" className="w-40" initialValue="1">
            <Select
              placeholder="Loại ngày"
              options={typeOptions}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item
            name={'rangePicker'}
            rules={[{ validator: validateDateRange }]}
            initialValue={[dayjs().subtract(29, 'day'), dayjs()]}
          >
            <CRangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format={formatDate}
              allowClear={false}
            />
          </Form.Item>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (!params.filters) {
      setSearchParams({
        ...params,
        filters: 0,
      });
    }
    if (!!params.filters && !params.isCallApi) {
      setSearchParams({
        ...params,
        isCallApi: 'true',
      });
    }
  }, [params.filters, params.isCallApi]);

  useEffect(() => {
    if (params) {
      form.setFieldsValue({
        ...params,
        rangePicker: [
          params.from
            ? dayjs(params.from, DateFormat.DATE_ISO)
            : dayjs().subtract(29, 'day'),
          params.to ? dayjs(params.to, DateFormat.DATE_ISO) : dayjs(),
        ],
      });
    }
  }, [params]);

  const handleFinish = (values: any) => {
    setSearchParams({
      ...params,
      ...values,
      status: values.status,
      payStatus: values.payStatus,
      requestType: values.requestType,
      queryTime: dayjs().format(DateFormat.DATE_TIME),
      from: values.rangePicker
        ? dayjs(values.rangePicker[0]).format(DateFormat.DATE_ISO)
        : undefined,
      to: values.rangePicker
        ? dayjs(values.rangePicker[1]).format(DateFormat.DATE_ISO)
        : undefined,
    });
  };

  return (
    <RowHeader>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{ auditStatus: '' }}
      >
        <Row gutter={8}>
          <Col>
            <CFilter
              searchComponent={
                <Form.Item name="param">
                  <CInput
                    title="Nhập MST/ Tên doanh nghiệp/ Người đại diện/ Người phụ trách/ Người tạo/ Người cập nhật"
                    placeholder="Nhập điều kiện tìm kiếm"
                    maxLength={100}
                  />
                </Form.Item>
              }
              items={items}
            />
          </Col>
          <BtnGroupFooter>
            <CButton
              disabled={positionCode === null}
              icon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => navigate(pathRoutes.businessManagementAdd)}
            >
              Thêm mới
            </CButton>
          </BtnGroupFooter>
        </Row>
      </Form>
    </RowHeader>
  );
};
