import { Form } from 'antd';
import { ImpactType, ModalProps, PromotionStatus } from '../types';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  NotificationSuccess,
} from '@react/commons/index';
import useSubscriptionStore from '../store';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { usePromotionMutation } from '../hooks/usePromotionMutation';
import { useDetailSubscriptionQuery } from '../hooks/useDetailSubscriptionQuery';
import { useIsAdmin } from '../hooks/useIsAdmin';

const PromotionModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const isAdmin = useIsAdmin();
  const [form] = Form.useForm();
  const { subscriberId, setSubscriberId } = useSubscriptionStore();
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { isFetching, data } = useDetailSubscriptionQuery(
    subscriberId,
    isAdmin
  );
  const isRegisterPromotion =
    data?.registerPromStatus === PromotionStatus.REGISTER;
  const actionCode = isRegisterPromotion
    ? ImpactType.CANCEL_PROM
    : ImpactType.REGISTER_PROM;
  const { data: reasonData } = useReasonCustomerService(actionCode, isOpen);
  const { isPending, mutate } = usePromotionMutation();

  const handleFinish = (values: any) => {
    CModalConfirm({
      message: `Bạn có chắc chắn muốn ${
        isRegisterPromotion ? 'hủy' : 'đăng ký lại'
      } chương trình khuyến mại?`,
      onOk: () =>
        mutate(
          { ...values, subId: subscriberId, actionCode },
          {
            onSuccess: () => {
              NotificationSuccess(
                `${
                  isRegisterPromotion ? 'Hủy' : 'Đăng ký lại'
                } chương trình khuyến mại thành công`
              );
              handleCancel();
            },
          }
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
      title={`${
        isRegisterPromotion ? 'Hủy' : 'Đăng ký lại'
      } chương trình khuyến mại`}
      okText="Thực hiện"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isFetching || isPending}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        colon={false}
        labelWrap
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
      </Form>
    </CModal>
  );
};

export default PromotionModal;
