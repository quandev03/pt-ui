import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose } from '@react/commons/Button';
import { Button, CModal, CTextArea } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import { useHandleApproval } from '../hooks/useHandleApproval';

export interface Props {
  onSubmit?: (value: string, handleCancel: () => void) => any;
  isOpen: boolean;
  isApproved?: boolean;
  setIsOpen: (value: boolean) => void;
}

const ModalConfirm: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  isApproved = false,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { isPending: isLoadingApproval } = useHandleApproval();
  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };
  const handleFinish = (values: any) => {
    setTimeout(onSubmit?.(values, handleCancel), 500);
  };
  return (
    <CModal
      title={!isApproved ? `Từ chối` : 'Phê duyệt'}
      open={isOpen}
      loading={isLoadingApproval}
      width={540}
      onCancel={handleCancel}
      className="modal-body-shorten"
      footer={[
        <CButtonClose type="default" htmlType="reset" onClick={handleCancel}>
          Đóng
        </CButtonClose>,
        <Button
          icon={<FontAwesomeIcon icon={faSave} />}
          onClick={form.submit}
          htmlType="submit"
          disabled={isLoadingApproval}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleFinish} colon={false}>
        <Form.Item
          labelAlign="left"
          label={'Ghi chú'}
          name="message"
          rules={[validateForm.required]}
          className="mb-0 cccc"
        >
          <CTextArea
            maxLength={200}
            placeholder="Nhập nội dung"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default ModalConfirm;
