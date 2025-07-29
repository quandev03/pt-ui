import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonClose } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CModal from '@react/commons/Modal';
import CTable from '@react/commons/Table';
import { RowHeader } from '@react/commons/Template/style';
import { IParamsRequest } from '@react/commons/types';
import { DateFormat } from '@react/constants/app';
import { formatDateBe } from '@react/constants/moment';
import { Form, Row, TablePaginationConfig, TableProps, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useCallback, useState } from 'react';
import { getNameTransType } from '../../constant';
import { useHistoryIsdn } from '../../queryHook/useHistoryIsdn';
import { PropsModal } from '../../type';
import { WrapperButton } from '../style';

const ModalHistoryPhoneNumber: FC<PropsModal> = ({ open, onClose, isdn }) => {
  const [form] = Form.useForm();
  const [params, setParams] = useState<
    IParamsRequest & { from: string; to: string }
  >({
    page: 0,
    size: 20,
    from: dayjs().subtract(29, 'day').format(formatDateBe),
    to: dayjs().format(formatDateBe),
  });

  const { data, isFetching } = useHistoryIsdn(isdn, params);
  console.log('🚀 ~ data:', data);

  const handleSearchForm = useCallback(
    (values: Record<string, string | [Dayjs, Dayjs]>) => {
      setParams({
        ...params,
        from: values.time
          ? (values.time as [Dayjs, Dayjs])[0].format(formatDateBe)
          : '',
        to: values.time
          ? (values.time as [Dayjs, Dayjs])[1].endOf('day').format(formatDateBe)
          : '',
        page: 0,
      });
    },
    [params]
  );

  const handleChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      setParams({
        ...params,
        page: pagination.current as number,
        size: pagination.pageSize as number,
      });
    },
    [params]
  );

  const columns: TableProps['columns'] = [
    {
      title: 'STT',
      dataIndex: 'id',
      width: 50,
      ellipsis: { showTitle: false },
      render: (value, record, index) => (
        <Tooltip title={index + 1 * params.page} placement="topLeft">
          {index + 1}
        </Tooltip>
      ),
    },
    {
      title: 'Loại tác động',
      dataIndex: 'transTypeStr',
      width: 120,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Từ kho',
      dataIndex: 'fromStock',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Đến kho',
      dataIndex: 'toStock',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Người tác động',
      dataIndex: 'byUser',
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'transDate',
      width: 120,
      render: (value) => (
        <Tooltip
          title={value ? dayjs(value).format(DateFormat.DATE_TIME) : ''}
          placement="topLeft"
        >
          {value ? dayjs(value).format(DateFormat.DEFAULT) : ''}
        </Tooltip>
      ),
    },
  ];

  const handleRefresh = () => {
    form.resetFields();
    return true;
  };

  const handleCloseModal = () => {
    form.resetFields();
    onClose();
  };

  return (
    <CModal
      width={1200}
      title={'Lịch sử số'}
      centered
      open={open}
      onCancel={() => handleCloseModal()}
      footer={null}
    >
      <RowHeader>
        <Form
          form={form}
          onFinish={handleSearchForm}
          colon={false}
          requiredMark={false}
          initialValues={{
            time: [dayjs().subtract(29, 'day'), dayjs()],
          }}
        >
          <Row gutter={[12, 16]}>
            <Form.Item name="time" className="ml-2">
              <CRangePicker />
            </Form.Item>
            <WrapperButton>
              <CButton htmlType="submit">Tìm kiếm</CButton>
              <FontAwesomeIcon
                icon={faRotateLeft}
                size="lg"
                className="cursor-pointer"
                onClick={handleRefresh}
                title="Làm mới"
              />
            </WrapperButton>
          </Row>
        </Form>
      </RowHeader>
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={data?.content ? data.content : []}
        loading={isFetching}
        pagination={{
          total: data?.totalElements ?? 0,
        }}
        onChange={handleChangeTable}
      />
      <div className="flex justify-end items-end mt-3">
        <CButtonClose onClick={() => handleCloseModal()}>Đóng</CButtonClose>
      </div>
    </CModal>
  );
};
export default ModalHistoryPhoneNumber;
