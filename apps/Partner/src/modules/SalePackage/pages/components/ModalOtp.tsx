import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react';
import { CButton, CInput, CModal, validateForm } from '@vissoft-react/common';
import { Form } from 'antd';

// Define the new, more generic props
interface ModalOtpProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (pinCode: string) => void;
  handleSuccess: () => void;
}

const ModalOtp = ({ open, loading, onClose, onConfirm }: ModalOtpProps) => {
  const [form] = useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = (values: { pinCode: string }) => {
    onConfirm(values.pinCode);
  };

  return (
    <CModal closeIcon open={open} onCancel={onClose} footer={null}>
      <div>
        <strong className="block text-center text-lg py-3">Xác nhận</strong>
        <p className="text-center mb-6">
          Nhập mã PIN để xác nhận thực hiện giao dịch:
        </p>
        <Form form={form} colon={false} onFinish={handleSubmit}>
          <Form.Item
            name="pinCode"
            label="Mã PIN"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            rules={[validateForm.required, validateForm.lengthNumber(6)]}
          >
            <CInput
              onlyNumber
              className="h-[36px]"
              maxLength={6}
              placeholder="Nhập mã PIN"
            />
          </Form.Item>
          <div className="flex justify-center items-center gap-4 mt-6">
            <CButton type="default" className="min-w-[90px]" onClick={onClose}>
              Hủy
            </CButton>
            <CButton
              loading={loading} // Use the loading prop
              className="min-w-[90px]"
              htmlType="submit"
            >
              Xác nhận
            </CButton>
          </div>
        </Form>
      </div>
    </CModal>
  );
};

export const ModalOtpMemo = React.memo(ModalOtp);
