import CButton, { CButtonClose } from '@react/commons/Button';
import { CModal, CTextArea } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter } from '@react/commons/Template/style';
import validateForm from '@react/utils/validator';
import { Checkbox, Col, Flex, Form } from 'antd';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useRequireCustomerUpdate } from '../../hooks/useRequireCustomerUpdate';

interface Props {
  open: boolean;
  setOpenModal: (value: boolean) => void;
  phoneNumber?: string;
  subDocumentId?: string;
}

export const ModalRequestUpdate = ({
  open,
  setOpenModal,
  phoneNumber,
  subDocumentId,
}: Props) => {
  const [form] = Form.useForm();
  const approveRejectReasonCode = Form.useWatch(
    'approveRejectReasonCode',
    form
  );
  const { data: approveReasonOptions, isLoading } =
    useReasonCustomerService('REASON_APPROVE');
  const { mutate: requireCustomerUpdateMutate } = useRequireCustomerUpdate();

  const handleSave = (value: any) => {
    ModalConfirm({
      message: 'common.confirmUpdate',
      handleConfirm: () => {
        requireCustomerUpdateMutate({
          isdn: phoneNumber || '',
          approveRejectReasonCode: value.approveRejectReasonCode,
          approveRejectNote: value.approveRejectNote,
          subDocumentId: subDocumentId || '',
        });
      },
    });
  };
  const handleClose = () => {
    setOpenModal(false);
    form.resetFields();
  };
  return (
    <CModal
      open={open}
      title="Yêu cầu cập nhật giấy tờ"
      onCancel={handleClose}
      footer={null}
    >
      <Form
        onFinish={handleSave}
        colon={false}
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          'checkbox-group': ['B'],
        }}
      >
        <Form.Item
          label="Lý do kiểm duyệt"
          rules={[validateForm.required]}
          name="approveRejectReasonCode"
        >
          <CSelect
            loading={isLoading}
            options={approveReasonOptions}
            placeholder="Chọn lý do từ chối"
            fieldNames={{ label: 'name', value: 'code' }}
            showSearch
            filterOption={(input, option) => {
              return option?.name?.toLowerCase().includes(input.toLowerCase());
            }}
          />
        </Form.Item>

        {approveRejectReasonCode === 'APPROVE_0' && (
          <Form.Item
            label="Ghi chú kiểm duyệt"
            rules={[validateForm.required]}
            name="approveRejectNote"
          >
            <CTextArea rows={3} maxLength={255} />
          </Form.Item>
        )}

        <Form.Item name="checkbox-group" wrapperCol={{ span: 24 }}>
          <Checkbox.Group className="!w-full">
            <Flex justify="space-evenly">
              <Checkbox value="A" style={{ lineHeight: '32px' }}>
                Ký bản cam kết
              </Checkbox>
              <Checkbox value="B" style={{ lineHeight: '32px' }}>
                Ký lại BBXN
              </Checkbox>
            </Flex>
          </Checkbox.Group>
        </Form.Item>

        <Col span={24}>
          <BtnGroupFooter style={{ justifyContent: 'center', marginTop: 30 }}>
            <CButtonClose onClick={handleClose} type="default">
              Đóng
            </CButtonClose>
            <CButton htmlType="submit" style={{ minWidth: 0 }}>
              Yêu cầu cập nhật
            </CButton>
          </BtnGroupFooter>
        </Col>
      </Form>
    </CModal>
  );
};
