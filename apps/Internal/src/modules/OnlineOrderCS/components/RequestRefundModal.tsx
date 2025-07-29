import { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CInput, CModal, CSelect } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Flex, Form } from 'antd';
import { useEffect } from 'react';
import { useRefundOrderCS, useUserRefund } from '../queryHooks';
import useOrderStore from '../stores';

interface Props {
  onRefundSuccess?: () => void;
}

export const RequestRefundModal: React.FC<Props> = ({ onRefundSuccess }) => {
  const [form] = Form.useForm();
  const { record, isOpenRefundModal, closeRefundModal } = useOrderStore();
  const { mutate: onRefund, isPending } = useRefundOrderCS(() => {
    handleCancel();
    onRefundSuccess && onRefundSuccess();
  });

  const { data: userList = [] } = useUserRefund();

  const handleFinish = (values: any) => {
    record?.id && onRefund({ id: record?.id, receiveUser: values.receiveUser });
  };

  const handleCancel = () => {
    closeRefundModal();
    form.resetFields();
  };

  useEffect(() => {
    if (isOpenRefundModal && record) {
      form.setFieldsValue({
        orderNo: record.orderNo,
        amountTotal: record.amountTotal,
      });
    }
  }, [record, isOpenRefundModal]);

  return (
    <CModal
      open={isOpenRefundModal}
      title={'Gửi yêu cầu hoàn tiền'}
      footer={[
        <Flex justify="end" gap={12} className="w-full">
          <CButtonClose type="default" onClick={handleCancel} />
          <CButtonSave
            onClick={form.submit}
            htmlType="submit"
            loading={isPending}
          />
        </Flex>,
      ]}
      width={800}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item label="Mã đơn hàng" name="orderNo">
          <CInput disabled placeholder="Mã đơn hàng" value={record?.orderNo} />
        </Form.Item>
        <Form.Item label="Tổng tiền hoàn" name="amountTotal">
          <CInput disabled placeholder="Tổng tiền hoàn" />
        </Form.Item>
        <Form.Item
          label="Người nhận yêu cầu hoàn tiền"
          name="receiveUser"
          rules={[validateForm.required]}
        >
          <CSelect
            options={userList}
            mode="multiple"
            showSearch
            placeholder="Người nhận yêu cầu hoàn tiền"
            maxRow={3}
          />
        </Form.Item>
      </Form>
    </CModal>
  );
};
