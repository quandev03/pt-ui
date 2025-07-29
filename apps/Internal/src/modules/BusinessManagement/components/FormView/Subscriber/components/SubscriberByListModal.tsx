import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  NotificationSuccess,
} from '@react/commons/index';
import CCheckbox from '@react/commons/Checkbox';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useParams } from 'react-router-dom';
import { ModalProps } from '../types';
import useSubscriberStore from '../store';
import { ImpactType } from 'apps/Internal/src/modules/SearchSubscription/types';
import { useSubscriberByListMutation } from '../hooks/useSubscriberByListMutation';
import { mapImpactTypeToText } from './SubscriberModal';

const SubscriberByListModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { subIds, setSubIds } = useSubscriberStore();
  const impactType = Form.useWatch('actionCode', form);
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const isShowMessage = Form.useWatch('isMessage', form);
  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { data: reasonData } = useReasonCustomerService(
    impactType,
    isOpen && !!impactType
  );
  const { isPending, mutate } = useSubscriberByListMutation();

  const handleFinish = (values: any) => {
    const newValues = { ...values, enterpriseId: id, idList: subIds };
    delete newValues.isMessage;
    const text = mapImpactTypeToText(values.actionCode);

    CModalConfirm({
      message: `Bạn có chắc chắn muốn ${text} thuê bao này?`,
      onOk: () =>
        mutate(newValues, {
          onSuccess: () => {
            setSubIds([]);
            handleCancel();
            NotificationSuccess(
              `Hệ thống đang xử lý ${text} danh sách thuê bao. Vui lòng theo dõi kết quả tại màn báo cáo tác động thuê bao theo file KHDN`
            );
          },
        }),
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Chặn/Mở thuê bao"
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
        initialValues={{ isMessage: true }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Loại tác động"
          name="actionCode"
          rules={[validateForm.required]}
        >
          <CSelect
            placeholder="Chọn loại tác động"
            showSearch={false}
            options={impactTypeData
              ?.filter((item) =>
                [
                  ImpactType.OPEN_1_WAY,
                  ImpactType.OPEN_2_WAY,
                  ImpactType.BLOCK_1_WAY,
                  ImpactType.BLOCK_2_WAY,
                ].includes(item.code as ImpactType)
              )
              ?.map((item) => ({
                label: item.name,
                value: item.code,
              }))}
            onChange={() => form.resetFields(['reasonCode'])}
          />
        </Form.Item>
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
        {impactType !== ImpactType.BLOCK_2_WAY && (
          <Form.Item name="isMessage" valuePropName="checked">
            <CCheckbox className="w-max">Thực hiện gửi tin nhắn</CCheckbox>
          </Form.Item>
        )}
        {isShowMessage && (
          <Form.Item
            label="Nội dung tin nhắn"
            name="message"
            rules={[validateForm.required]}
          >
            <CTextArea placeholder="Nhập nội dung tin nhắn" maxLength={200} />
          </Form.Item>
        )}
      </Form>
    </CModal>
  );
};

export default SubscriberByListModal;
