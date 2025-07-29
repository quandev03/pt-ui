import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
} from '@react/commons/index';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { ModalProps } from '../types';
import useSubscriberStore from '../store';
import { useCancelSubscriberByListMutation } from '../hooks/useCancelSubscriberByListMutation';
import { useParams } from 'react-router-dom';

const CancelSubscriberByListModal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const { subIds, setSubIds } = useSubscriberStore();
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { data: reasonData } = useReasonCustomerService('DEACTIVE', isOpen);
  const { isPending, mutate } = useCancelSubscriberByListMutation();

  const handleFinish = (values: any) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn hủy thuê bao?',
      onOk: () =>
        mutate(
          { ...values, enterpriseId: id, listIds: subIds },
          {
            onSuccess: () => {
              handleCancel();
              setSubIds([]);
            },
          }
        ),
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
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
        <Form.Item label="Ghi chú" name="description">
          <CTextArea placeholder="Nhập ghi chú" maxLength={250} />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default CancelSubscriberByListModal;
