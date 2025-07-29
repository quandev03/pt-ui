import { Form } from 'antd';
import { ModalProps } from '../types';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  CUploadFileTemplate,
} from '@react/commons/index';
import { useCancelSubscriberMutation } from '../hooks/useCancelSubscriberMutation';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import useSubscriptionStore from '../store';

const CancelSubscriberModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { subscriberId, setSubscriberId } = useSubscriptionStore();
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { data: reasonData } = useReasonCustomerService('DEACTIVE', isOpen);
  const { isPending, mutate } = useCancelSubscriberMutation(form);

  const handleFinish = (values: any) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn hủy thuê bao?',
      onOk: () =>
        mutate(
          {
            data: {
              subId: subscriberId,
              reasonCode: values.reasonCode,
              otherReason: values.otherReason,
            },
            confirmationLetter: values.confirmationLetter,
          },
          { onSuccess: handleCancel }
        ),
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setSubscriberId('');
  };

  return (
    <CModal
      open={isOpen}
      title="Hủy thuê bao"
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
            <CTextArea placeholder="Nhập lý do khác" maxLength={200} />
          </Form.Item>
        )}
        <CUploadFileTemplate
          label="Biên bản xác nhận"
          name="confirmationLetter"
          required
        />
      </Form>
    </CModal>
  );
};

export default CancelSubscriberModal;
