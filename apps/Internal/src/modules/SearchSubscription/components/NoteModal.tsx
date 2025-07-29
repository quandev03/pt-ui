import { Form } from 'antd';
import { ModalProps } from '../types';
import { CModal, CTextArea } from '@react/commons/index';
import { useNoteMutation } from '../hooks/useNoteMutation';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import validateForm from '@react/utils/validator';

const NoteModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const formInstance = Form.useFormInstance();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { isPending, mutate } = useNoteMutation();

  useEffect(() => {
    isOpen &&
      form.setFieldValue('note', formInstance.getFieldValue('description'));
  }, [isOpen]);

  const handleFinish = (values: any) => {
    mutate({ id: id ?? '', note: values.note }, { onSuccess: handleCancel });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Ghi chú"
      okText="Lưu"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isPending}
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item name="note" rules={[validateForm.required]}>
          <CTextArea placeholder="Nhập ghi chú *" rows={3} maxLength={200} />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default NoteModal;
