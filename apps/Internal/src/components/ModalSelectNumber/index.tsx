import {
  faPlus,
  faRotateLeft,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonClose } from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CModal from '@react/commons/Modal';
import CTable from '@react/commons/Table';
import { RowButton, Text } from '@react/commons/Template/style';
import { Col, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { TableProps, Tooltip } from 'antd/lib';
import React, { useCallback, useEffect, useState } from 'react';
import useGetStockIsdn, {
  IGetStockIsdnParams,
  IStockIsdn,
} from './useGetStockIsdn';

type Props = {
  onCancel: () => void;
  open: boolean;
  defaultSelected: IStockIsdn[];
  nameField: string;
  onSave: (selectedRows: IStockIsdn[]) => void;
};

const ModalSelectNumber = ({
  onCancel,
  open,
  defaultSelected,
  nameField,
  onSave,
}: Props) => {
  const [form] = Form.useForm();
  const useFormInstance = Form.useFormInstance();
  const stockId = useWatch(nameField, useFormInstance);

  const [params, setParams] = useState<IGetStockIsdnParams>({
    page: 1,
    size: 20,
    stockId: stockId,
  });

  const { data: dataTable, isLoading: loadingTable } = useGetStockIsdn({
    ...params,
    stockId: stockId,
  });

  const columns: ColumnsType<IStockIsdn> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 80,
      render(_, record, index) {
        return <Text>{index + 1 + (params.page - 1) * params.size}</Text>;
      },
    },
    {
      title: 'Số',
      dataIndex: 'isdn',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nhóm số',
      dataIndex: 'groupCode',
      width: 120,
      align: 'left',
      render(value) {
        const text = value ? `Nhóm ${value}` : '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Định dạng số',
      dataIndex: 'generalFormat',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<IStockIsdn[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedRowKeys(defaultSelected.map((item) => item.id));
    }
  }, [defaultSelected, open]);

  const handleReset = useCallback(() => {
    form.resetFields();
    setParams({
      page: 1,
      size: 20,
      stockId: stockId,
    });
  }, [stockId]);

  const rowSelection: TableProps<IStockIsdn>['rowSelection'] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IStockIsdn[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    preserveSelectedRowKeys: true,
  };

  const handleSave = () => {
    onSave(selectedRows);
  };

  return (
    <CModal
      title="Chọn số"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="modal-body-shorten"
    >
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Form
            form={form}
            onFinish={(values: Record<string, any>) => {
              setParams({ ...params, ...values, page: 1 });
            }}
          >
            <div className="flex gap-3">
              <Form.Item name="isdn">
                <CInput
                  placeholder="Nhập số"
                  className="!w-64"
                  maxLength={10}
                  onlyNumber
                  allowClear={false}
                  prefix={<FontAwesomeIcon icon={faSearch} size="sm" />}
                />
              </Form.Item>
              <div>
                <CButton htmlType="submit">Tìm kiếm</CButton>
                <FontAwesomeIcon
                  onClick={handleReset}
                  icon={faRotateLeft}
                  size="lg"
                  className="cursor-pointer ml-3"
                  title="Làm mới"
                />
              </div>
            </div>
          </Form>
        </Col>
        <Col span={24}>
          <CTable
            scroll={{ y: 400 }}
            id="common-table"
            loading={loadingTable}
            columns={columns}
            rowKey="id"
            dataSource={dataTable?.content}
            rowSelection={{
              ...rowSelection,
              preserveSelectedRowKeys: true,
            }}
            pagination={{
              total: dataTable?.totalElements ?? 0,
              pageSize: params.size,
              current: params.page,
              onChange: (page, pageSize) =>
                setParams({ ...params, page, size: pageSize }),
            }}
          />
        </Col>
        <Col span={24}>
          <RowButton className="my-6">
            <CButton
              disabled={selectedRowKeys.filter(Boolean).length === 0}
              onClick={handleSave}
              icon={<FontAwesomeIcon icon={faPlus} size="lg" />}
            >
              Lưu
            </CButton>
            <CButtonClose onClick={onCancel} />
          </RowButton>
        </Col>
      </Row>
    </CModal>
  );
};

export default ModalSelectNumber;
