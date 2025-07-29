import { Form } from 'antd';
import { ModalProps } from '../types';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
} from '@react/commons/index';
import { useZoneMutation } from '../hooks/useZoneMutation';
import { useEffect, useMemo } from 'react';
import useSubscriptionStore from '../store';
import { useDetailSubscriptionQuery } from '../hooks/useDetailSubscriptionQuery';
import { useIsAdmin } from '../hooks/useIsAdmin';
import {
  CadastralType,
  useCadastralQuery,
} from 'apps/Internal/src/hooks/useCadastralQuery';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';

const ZoneModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const isAdmin = useIsAdmin();
  const [form] = Form.useForm();
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { subscriberId, setSubscriberId } = useSubscriptionStore();
  const { isFetching, data } = useDetailSubscriptionQuery(
    subscriberId,
    isAdmin
  );
  const { provinces } = useCadastralQuery({ type: CadastralType.PROVINCE });
  const { data: reasonData } = useReasonCustomerService('CHANGE_ZONE', isOpen);
  const { isPending, mutate } = useZoneMutation();

  useEffect(() => {
    if (isOpen && data?.zoneChangeHistory) {
      form.setFieldValue('currentZone', data.zoneChangeHistory);
    }
  }, [isOpen, data?.zoneChangeHistory]);

  const provinceOptions = useMemo(() => {
    return provinces?.map((item) => ({
      label: `${item.areaName} - ${item.mbfAreaCode}`,
      value: item.mbfAreaCode,
    }));
  }, [provinces]);

  const handleFinish = (values: any) => {
    CModalConfirm({
      message: 'Bạn có chắc chắn muốn đổi Zone?',
      onOk: () => {
        const newValues = {
          ...values,
          id: subscriberId,
          description: `Đổi Zone từ ${data?.zoneChangeHistory} thành ${values.zone}`,
        };
        delete newValues.currentZone;

        mutate(newValues, { onSuccess: handleCancel });
      },
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
      title="Đổi Zone"
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
        <Form.Item label="Zone hiện tại" name="currentZone">
          <CSelect
            placeholder="Zone hiện tại"
            suffixIcon={null}
            disabled
            options={provinceOptions}
          />
        </Form.Item>
        <Form.Item label="Zone mới" name="zone" rules={[validateForm.required]}>
          <CSelect
            placeholder="Chọn Zone mới"
            options={provinceOptions.filter(
              (item) => item.value !== data?.zoneChangeHistory
            )}
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
            name="reasonText"
            rules={[validateForm.required]}
          >
            <CTextArea placeholder="Nhập lý do khác" maxLength={200} />
          </Form.Item>
        )}
      </Form>
    </CModal>
  );
};

export default ZoneModal;
