import { CModal, CSelect, CTextArea } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Checkbox, Form } from 'antd';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useCheckActiveIsdn } from '../queryHooks';
import useFeedbackStore from '../store';
import {
  IFeedback,
  ModalTypeReason,
  PageFilterEnum,
  ReasonEnum,
} from '../types';

interface IProp {
  onSubmit: (values: any, ids: number[], type: ModalTypeReason) => void;
  type?: PageFilterEnum;
  confirmLoading?: boolean;
  selectedFeedback?: IFeedback[];
}

const ReasonModal: React.FC<IProp> = ({
  onSubmit,
  type,
  confirmLoading,
  selectedFeedback,
}) => {
  const [form] = Form.useForm();
  const reason = Form.useWatch('reason', form);
  const isSendMessage = Form.useWatch('isSendMessage', form);
  const { modalIds, setOpenReasonModal, typeModalReason } = useFeedbackStore();
  const { data: listReasons, isLoading } = useReasonCustomerService('FEEDBACK');
  const isdn = selectedFeedback?.map((feedback) => feedback.isdn);
  const { data: checkIsdnResp } = useCheckActiveIsdn({ isdn: isdn });
  const handleFinish = (values: any) => {
    onSubmit(values, modalIds as number[], typeModalReason);
  };

  const handleCancel = () => {
    // setIsOpen(false);
    setOpenReasonModal(false, []);
    form.resetFields();
  };

  const getTitle = () => {
    switch (typeModalReason) {
      case 'cancel':
        return 'Hủy yêu cầu phản ánh';
      case 'close':
        return 'Đóng yêu cầu phản ánh';
      case 'open':
        return 'Mở yêu cầu phản ánh';
      case 'reject':
        return 'Nhập lý do';
    }
  };
  return (
    <CModal
      open={true}
      title={getTitle()}
      okText="Xác nhận"
      confirmLoading={confirmLoading}
      cancelText="Huỷ"
      onOk={form.submit}
      onCancel={handleCancel}
      className="modal-body-shorten"
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        colon={false}
        onFinish={handleFinish}
      >
        {typeModalReason !== 'close' && (
          <Form.Item
            label="Lý do"
            name="reason"
            rules={[validateForm.required]}
          >
            {typeModalReason === 'open' ? (
              <CTextArea maxLength={1000} placeholder="Nhập nội dung" />
            ) : (
              <CSelect
                fieldNames={{ label: 'name', value: 'code' }}
                filterOption={(input, options: any) =>
                  (options?.name ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                placeholder="Chọn lý do"
                options={listReasons}
                isLoading={isLoading}
              />
            )}
          </Form.Item>
        )}
        {reason === ReasonEnum.OTHER && (
          <Form.Item
            label="Lý do khác"
            name="description"
            rules={[validateForm.required]}
          >
            <CTextArea maxLength={200} rows={4}></CTextArea>
          </Form.Item>
        )}
        {typeModalReason === 'close' && (
          <>
            <Form.Item
              label="Nội dung"
              name="note"
              rules={[validateForm.required]}
            >
              <CTextArea maxLength={200} rows={4}></CTextArea>
            </Form.Item>
            {checkIsdnResp && checkIsdnResp.message === 'TRUE' && (
              <>
                {' '}
                <Form.Item
                  label="Thực hiện gửi tin nhắn"
                  name="isSendMessage"
                  valuePropName="checked"
                >
                  <Checkbox></Checkbox>
                </Form.Item>
                {isSendMessage && (
                  <Form.Item
                    label="Nội dung tin nhắn"
                    name="message"
                    rules={[validateForm.required]}
                  >
                    <CTextArea maxLength={200} rows={4}></CTextArea>
                  </Form.Item>
                )}
              </>
            )}
          </>
        )}
      </Form>
    </CModal>
  );
};

export default ReasonModal;
