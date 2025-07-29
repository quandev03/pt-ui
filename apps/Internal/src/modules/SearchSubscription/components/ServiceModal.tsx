import { Form } from 'antd';
import { ModalProps } from '../types';
import validateForm from '@react/utils/validator';
import { CModal, CModalConfirm, CSelect } from '@react/commons/index';

const ServiceModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn đăng ký dịch vụ này?',
      onOk: () => console.log('values >> ', values),
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Đăng ký/Hủy dịch vụ"
      okText="Thực hiện"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Loại tác động"
          name="reason"
          rules={[validateForm.required]}
        >
          <CSelect placeholder="Chọn loại tác động" options={[{ value: 1 }]} />
        </Form.Item>
        <Form.Item
          label="Dịch vụ"
          name="reason"
          rules={[validateForm.required]}
        >
          <CSelect placeholder="Chọn dịch vụ" options={[{ value: 1 }]} />
        </Form.Item>
        <Form.Item label="Lý do" name="reason" rules={[validateForm.required]}>
          <CSelect placeholder="Chọn lý do" options={[{ value: 1 }]} />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default ServiceModal;
