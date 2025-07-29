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
import { useEffect, useState } from 'react';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useParams } from 'react-router-dom';
import { ModalProps } from '../types';
import useSubscriberStore from '../store';
import { useDetailSubscriberQuery } from '../hooks/useDetailSubscriberQuery';
import { ImpactType } from 'apps/Internal/src/modules/SearchSubscription/types';
import { useSubscriberMutation } from 'apps/Internal/src/modules/SearchSubscription/hooks/useSubscriberMutation';
import { useQueryClient } from '@tanstack/react-query';

export const mapImpactTypeToText = (type: ImpactType) => {
  switch (type) {
    case ImpactType.BLOCK_1_WAY:
      return 'chặn một chiều';
    case ImpactType.BLOCK_2_WAY:
      return 'chặn hai chiều';
    case ImpactType.OPEN_1_WAY:
      return 'mở một chiều';
    case ImpactType.OPEN_2_WAY:
      return 'mở hai chiều';
    default:
      return '';
  }
};

const SubscriberModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { subId, setSubId } = useSubscriberStore();
  const impactType = Form.useWatch('actionCode', form);
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const isShowMessage = Form.useWatch('isMessage', form);
  const [impactTypes, setImpactTypes] = useState<any>();
  const { isFetching, data } = useDetailSubscriberQuery(id, subId);
  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { data: reasonData } = useReasonCustomerService(
    impactType,
    isOpen && !!impactType
  );
  const { isPending, mutate } = useSubscriberMutation();

  useEffect(() => {
    if (isOpen && data?.activeStatus) {
      switch (data.activeStatus) {
        case 1: // Bình thường
          setImpactTypes(
            impactTypeData?.filter((item) =>
              [ImpactType.BLOCK_1_WAY, ImpactType.BLOCK_2_WAY].includes(
                item.code as ImpactType
              )
            )
          );
          break;
        case 10: // Chặn 1 chiều
        case 11:
          setImpactTypes(
            impactTypeData?.filter((item) =>
              [ImpactType.OPEN_1_WAY, ImpactType.BLOCK_2_WAY].includes(
                item.code as ImpactType
              )
            )
          );
          break;
        case 20: // Chặn 2 chiều
        case 21:
          setImpactTypes(
            impactTypeData?.filter(
              (item) => item.code === ImpactType.OPEN_2_WAY
            )
          );
          break;
        default:
          setImpactTypes([]);
      }
    }
  }, [isOpen, data?.activeStatus, impactTypeData]);

  const handleFinish = (values: any) => {
    const newValues = { ...values, subId };
    delete newValues.isMessage;

    CModalConfirm({
      message: `Bạn có chắc chắn muốn ${mapImpactTypeToText(
        values.actionCode
      )} thuê bao này?`,
      onOk: () =>
        mutate(newValues, {
          onSuccess: (res) => {
            queryClient.invalidateQueries({
              queryKey: ['GET_LIST_SUBSCRIBER_ENTERPRISE'],
            });
            handleCancel();
            NotificationSuccess(res.message);
          },
        }),
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
      title="Chặn/Mở thuê bao"
      okText="Thực hiện"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isFetching || isPending}
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
            options={impactTypes?.map((item: any) => ({
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

export default SubscriberModal;
