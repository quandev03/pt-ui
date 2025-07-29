import { Form } from 'antd';
import { ImpactStatus, ImpactType, ModalProps } from '../types';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  NotificationSuccess,
} from '@react/commons/index';
import { useParams } from 'react-router-dom';
import { useImpactMutation } from '../hooks/useImpactMutation';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useDetailSubscriptionQuery } from '../hooks/useDetailSubscriptionQuery';
import { useIsAdmin } from '../hooks/useIsAdmin';
import useSubscriptionStore from '../store';

const ImpactModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const isAdmin = useIsAdmin();
  const [form] = Form.useForm();
  const { id } = useParams();
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { subscriberNoImpactIds, setSubscriberNoImpactIds } =
    useSubscriptionStore();
  const { isFetching, data } = useDetailSubscriptionQuery(id ?? '', isAdmin);
  const { data: reasonData } = useReasonCustomerService(
    data?.actionAllow === ImpactStatus.OPEN
      ? ImpactType.BLOCK_ACTION
      : ImpactType.OPEN_ACTION,
    isOpen
  );
  const { isPending, mutate } = useImpactMutation();

  const handleFinish = (values: any) => {
    const isBlock = data?.actionAllow === ImpactStatus.OPEN;
    CModalConfirm({
      message: `Bạn có chắc chắn muốn ${
        isBlock ? 'cấm' : 'mở'
      } tác động thuê bao này?`,
      onOk: () => {
        const newValues = subscriberNoImpactIds.length
          ? {
              ...values,
              listSubID: subscriberNoImpactIds,
              actionCode: ImpactType.OPEN_ACTION,
            }
          : {
              ...values,
              subId: id ?? '',
              actionCode: isBlock
                ? ImpactType.BLOCK_ACTION
                : ImpactType.OPEN_ACTION,
            };

        mutate(newValues, {
          onSuccess: () => {
            handleCancel();
            setSubscriberNoImpactIds([]);
            NotificationSuccess(
              subscriberNoImpactIds.length
                ? 'Hệ thống đang xử lý, vui lòng chờ'
                : `${isBlock ? 'Cấm' : 'Mở'} tác động thành công`
            );
          },
        });
      },
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title={`${
        data?.actionAllow === ImpactStatus.OPEN ? 'Cấm' : 'Mở'
      } tác động thuê bao`}
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
            name="reasonNote"
            rules={[validateForm.required]}
          >
            <CTextArea placeholder="Nhập lý do khác" maxLength={200} />
          </Form.Item>
        )}
        <Form.Item label="Mô tả" name="description">
          <CTextArea placeholder="Nhập mô tả" maxLength={200} />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default ImpactModal;
