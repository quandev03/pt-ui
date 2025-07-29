import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import { CModal, CTextArea } from '@react/commons/index';
import useOrderCSStore from '../stores';
import { useCancelOrderCs } from '../queryHooks';

interface Props {
  onCancelSuccess?: () => void;
}

export const CancelOrderModal: React.FC<Props> = ({
  onCancelSuccess,
}: Props) => {
  const [form] = Form.useForm();
  const { isOpenCancelModal, record, closeCancelModal } = useOrderCSStore();
  const { mutate: onCancelOrderCs, isPending } = useCancelOrderCs(() => {
    handleCancel();
    onCancelSuccess && onCancelSuccess();
  });
  const handleFinish = (values: any) => {
    record?.id && onCancelOrderCs({ id: record?.id, note: values.reason });
  };

  const handleCancel = () => {
    closeCancelModal();
    form.resetFields();
  };

  return (
    <CModal
      open={isOpenCancelModal}
      title={'Xác nhận'}
      okText="Có"
      cancelText="Không"
      onOk={form.submit}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <p style={{ textAlign: 'center', marginBottom: 20 }}>
        Bạn có chắc chắn muốn hủy đơn hàng này không?
      </p>

      <Form
        form={form}
        labelCol={{ span: 4 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item label="Lý do" name="reason" rules={[validateForm.required]}>
          <CTextArea placeholder="Lý do" rows={3} maxLength={200}/>
        </Form.Item>
      </Form>
    </CModal>
  );
};
