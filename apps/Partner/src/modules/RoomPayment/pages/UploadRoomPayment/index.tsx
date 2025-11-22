import {
  CButtonClose,
  CButtonSave,
  CModal,
  TitleHeader,
} from '@vissoft-react/common';
import { Col, Form, Row, Upload, Select, InputNumber, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { memo, useEffect } from 'react';
import { useLogicUploadRoomPayment } from './useLogicUploadRoomPayment';
import { MonthOptions } from '../../constants/enum';
import type { UploadFile } from 'antd/es/upload/interface';

interface UploadRoomPaymentProps {
  open: boolean;
  onClose: () => void;
}

export const UploadRoomPayment = memo(({ open, onClose }: UploadRoomPaymentProps) => {
  const { form, loadingUpload, handleSubmit, handleDownloadTemplate } =
    useLogicUploadRoomPayment(onClose);

  useEffect(() => {
    if (open) {
      form.resetFields();
      // Set default year to current year
      form.setFieldValue('year', new Date().getFullYear());
    }
  }, [open, form]);

  const beforeUpload = (file: File) => {
    const isExcel =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.xlsx');
    if (!isExcel) {
      message.error('Chỉ chấp nhận file Excel (.xlsx)');
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <CModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<TitleHeader>Tạo thanh toán từ file Excel</TitleHeader>}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="1. Chọn file Excel"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn file Excel',
                },
              ]}
            >
              <Upload
                beforeUpload={beforeUpload}
                maxCount={1}
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              >
                <button type="button" className="ant-btn ant-btn-default">
                  <UploadOutlined /> Chọn file
                </button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="2. Chọn tháng thanh toán"
              name="month"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn tháng',
                },
              ]}
            >
              <Select
                placeholder="Chọn tháng"
                options={MonthOptions}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="3. Nhập năm thanh toán"
              name="year"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập năm',
                },
                {
                  type: 'number',
                  min: 2020,
                  message: 'Năm phải >= 2020',
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập năm"
                style={{ width: '100%' }}
                min={2020}
                max={2100}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="border rounded p-4 bg-gray-50">
              <div className="font-semibold mb-2">Format file Excel:</div>
              <div className="text-sm text-gray-600">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2">Mã phòng</th>
                      <th className="border border-gray-300 p-2">Số điện sử dụng</th>
                      <th className="border border-gray-300 p-2">Số nước sử dụng</th>
                      <th className="border border-gray-300 p-2">Số xe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">P001</td>
                      <td className="border border-gray-300 p-2">100</td>
                      <td className="border border-gray-300 p-2">10</td>
                      <td className="border border-gray-300 p-2">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>

          <Col span={24}>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Tải file mẫu
            </button>
          </Col>
        </Row>

        <div className="flex gap-4 justify-end mt-6">
          <CButtonClose onClick={onClose} />
          <CButtonSave
            onClick={() => form.submit()}
            loading={loadingUpload}
            disabled={loadingUpload}
          />
        </div>
      </Form>
    </CModal>
  );
});

