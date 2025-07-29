import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  CUploadFileTemplate,
} from '@react/commons/index';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { ModalProps } from '../types';
import useSubscriberStore from '../store';
import { useCancelSubscriberMutation } from '../hooks/useCancelSubscriberMutation';

const CancelSubscriberModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { subId, setSubId } = useSubscriberStore();
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { data: reasonData } = useReasonCustomerService('DEACTIVE', isOpen);
  const { isPending, mutate } = useCancelSubscriberMutation(form);

  const handleFinish = ({ confirmationLetter, ...values }: any) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn cắt hủy thuê bao?',
      onOk: () =>
        mutate(
          { data: { ...values, subId }, confirmationLetter },
          { onSuccess: handleCancel }
        ),
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setSubId('');
  };

  return (
    <CModal
      open={isOpen}
      title="Cắt hủy thuê bao"
      okText="Thực hiện"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isPending}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Lý do"
          name="reasonCode"
          rules={[validateForm.required]}
        >
          <CSelect
            placeholder="Chọn lý do"
            options={reasonData?.map((item) => ({
              label: item.name,
              value: item.code,
            }))}
          />
        </Form.Item>
        {isShowReason && (
          <Form.Item
            label="Lý do khác"
            name="otherReason"
            rules={[validateForm.required]}
          >
            <CTextArea placeholder="Nhập lý do khác" maxLength={250} />
          </Form.Item>
        )}
        <CUploadFileTemplate
          label="Biên bản xác nhận"
          name="confirmationLetter"
          required
          sizeMaxMB={10}
        />
        <Form.Item label="Ghi chú" name="description">
          <CTextArea placeholder="Nhập ghi chú" maxLength={250} />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default CancelSubscriberModal;
