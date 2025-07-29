import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { Col, Form, Row, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { Key, useEffect } from 'react';
import CInput from '@react/commons/Input';
import { decodeSearchParams } from '@react/helpers/utils';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import AssignModal from './AssignModal';
import { useListApproveStatus } from '../../ActivationRequestList/queryHook/useList';
import { CRangePicker } from '@react/commons/DatePicker';
import { formatDate } from '@react/constants/moment';
import dayjs from 'dayjs';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useActivationAssignedStore } from '../store';

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: (any: boolean) => void;
  selectedRowKeys: Key[];
  setSelectedRowKeys: (keys: Key[]) => void;
  setParamsTab?: (obj: object) => void;
};

const Header: React.FC<Props> = ({
  isOpenModal,
  setIsOpenModal,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_ASSIGN_LIST
  );
  const { data: dataApproveStatus } = useListApproveStatus();
  const approveStatusOptions = dataApproveStatus?.map((status: any) => ({
    label: status.value,
    value: parseInt(status.code),
  }));
  const { setClickSearch } = useActivationAssignedStore();

  useEffect(() => {
    form.submit();
  }, [params['type-date']]);

  useEffect(() => {
    if (params) {
      const { fromDate, toDate, number, status, ...rest } = params;
      const from = fromDate
        ? dayjs(fromDate, formatDate)
        : dayjs().subtract(29, 'day');
      const to = toDate ? dayjs(toDate, formatDate) : dayjs();
      const stt = status !== '' ? status : undefined;
      form.setFieldsValue({
        ...rest,
        status: stt,
        'type-approve': params['type-approve'],
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

  const assignOptions = [
    { label: 'Chưa phân công', value: '1' },
    { label: 'Đã phân công', value: '2' },
  ];
  const typeOptions = [
    { label: 'Ngày tạo yêu cầu', value: '1' },
    { label: 'Ngày tiền kiểm', value: '2' },
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
      label: 'Trạng thái phân công',
      value: (
        <Form.Item name={`type-approve`} className="w-40">
          <CSelect
            placeholder="Trạng thái phân công"
            options={assignOptions}
            allowClear={false}
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
          <Form.Item name={'type-date'} className="w-40">
            <Select
              placeholder="Loại ngày"
              options={typeOptions}
              allowClear={false}
            />
          </Form.Item>
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

  const handleFinish = (values: any) => {
    const { rangePicker, ...rest } = values;
    const [fromDate, toDate] = rangePicker || [
      dayjs().subtract(29, 'day'),
      dayjs(),
    ];
    const newType = values['type-date'] ?? '1';
    const newTypeApprove = values['type-approve'] ?? '1';
    const filters = params.filters ?? '1,2';

    setSearchParams({
      ...params,
      ...rest,
      'type-date': newType,
      'type-approve': newTypeApprove,
      fromDate: fromDate.format(formatDate),
      toDate: toDate.format(formatDate),
      page: 0,
      size: 1000,
      filters,
    });
    setClickSearch(true)
    handleSearch(params);
  };

  return (
    <div>
      <TitleHeader>Danh sách phân công tiền kiểm</TitleHeader>
      {/* <RowHeader> */}

      <RowHeader>
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          initialValues={{ 'type-date': '1', 'type-approve': '1' }}
        >
          <Row gutter={[8, 16]}>
            <Col>
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
            </Col>
            <br />
            <br />
          </Row>
        </Form>
      </RowHeader>
      <AssignModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </div>
  );
};

export default Header;
