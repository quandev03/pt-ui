import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  NotificationSuccess,
} from '@react/commons/index';
import { useLocation, useParams } from 'react-router-dom';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { ModalProps } from '../types';
import { useDetailSubscriberQuery } from '../hooks/useDetailSubscriberQuery';
import {
  ImpactStatus,
  ImpactType,
} from 'apps/Internal/src/modules/SearchSubscription/types';
import { useImpactMutation } from 'apps/Internal/src/modules/SearchSubscription/hooks/useImpactMutation';
import { useQueryClient } from '@tanstack/react-query';

const ImpactModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { isFetching, data } = useDetailSubscriberQuery(id, state.subId);
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
        mutate(
          {
            ...values,
            subId: state.subId,
            actionCode: isBlock
              ? ImpactType.BLOCK_ACTION
              : ImpactType.OPEN_ACTION,
          },
          {
            onSuccess: () => {
              handleCancel();
              queryClient.invalidateQueries({
                queryKey: ['GET_DETAIL_SUBSCRIBER_ENTERPRISE'],
              });
              NotificationSuccess(
                `${isBlock ? 'Cấm' : 'Mở'} tác động thành công`
              );
            },
          }
        );
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
