import { Button, NotificationSuccess } from '@react/commons/index';
import CModal from '@react/commons/Modal';
import CSelect from '@react/commons/Select';
import CInput from '@react/commons/Input'; // Import CInput
import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Key, useState } from 'react'; // Import useState
import { useRejectFn } from '../queryHook/useReject';
import { useReason } from '../queryHook/useReason';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel } from '@fortawesome/free-solid-svg-icons';
import { CButtonClose } from '@react/commons/Button';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedRowKeys: Key[];
  setSelectedRowKeys: (value: Key[]) => void;
};

const RejectModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [showReasonInput, setShowReasonInput] = useState(false);
  const { data: dataReasonReject } = useReason();
  const reasonOptions = dataReasonReject?.map((item: any) => ({
    label: `${item.code} (${item.name})`,
    value: item.code,
  }));
  const { mutate: rejectFn } = useRejectFn(form, () => {
    NotificationSuccess('Từ chối hồ sơ yêu cầu kích hoạt thành công');
    navigate(-1);
  });

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setShowReasonInput(false);
  };

  const handleFinish = () => {
    rejectFn(form.getFieldsValue());
    setSelectedRowKeys([]);
    setIsOpen(false);
  };

  const handleReasonChange = (value: string) => {
    setShowReasonInput(value === 'OTHER');
  };

  return (
    <CModal
      title={'Từ chối yêu cầu kích hoạt'}
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <CButtonClose key="close" type="default" onClick={handleCancel}>
          Đóng
        </CButtonClose>,
        <Button
          key="submit"
          htmlType="submit"
          onClick={() => {
            form.setFieldValue('listIds', selectedRowKeys);
            form.submit();
          }}
          icon={<FontAwesomeIcon icon={faCancel} />}
        >
          Từ chối
        </Button>,
      ]}
    >
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFinish={handleFinish}
        validateTrigger={['onSubmit']}
      >
        <Form.Item label="" name="reasonReject" hidden />
        <Form.Item
          label="Lý do từ chối"
          name="reasonReject"
          rules={[
            {
              required: true,
              message: 'Không được để trống trường này',
            },
          ]}
        >
          <CSelect
            placeholder="Chọn lí do từ chối"
            options={reasonOptions}
            onChange={handleReasonChange}
          />
        </Form.Item>

        {showReasonInput && (
          <Form.Item
            label=""
            name="reasonNoteReject"
            rules={[
              {
                required: showReasonInput,
                message: 'Không được để trống trường này',
              },
            ]}
          >
            <CInput placeholder="Nhập lý do" maxLength={100} />
          </Form.Item>
        )}

        <Form.Item label="" name="listIds" hidden />
      </Form>
    </CModal>
  );
};

export default RejectModal;
