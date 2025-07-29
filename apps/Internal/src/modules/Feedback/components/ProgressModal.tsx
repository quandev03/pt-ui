import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import { CModal, CTextArea } from '@react/commons/index';
import useFeedbackStore from '../store';
import CTableUploadFile from './CUpload';

interface IProp {
  onSubmit: (values: any, fileList: any[], ids: number[]) => void;
  confirmLoading?: boolean;
}

const ProgressModal: React.FC<IProp> = ({ onSubmit, confirmLoading }) => {
  const [form] = Form.useForm();
  const { modalIds, setOpenProgressModal } = useFeedbackStore();

  const handleFinish = (values: any) => {
    onSubmit(
      values,
      form.getFieldValue('files')?.map((item: any) => item?.files),
      modalIds as number[]
    );
  };

  const handleCancel = () => {
    // setIsOpen(false);
    setOpenProgressModal(false, []);
    form.resetFields();
  };

  return (
    <CModal
      open={true}
      title="Nhập nội dung xử lý"
      okText="Xác nhận"
      confirmLoading={confirmLoading}
      cancelText="Huỷ"
      onOk={form.submit}
      onCancel={handleCancel}
      width={1200}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[validateForm.required]}
        >
          <CTextArea maxLength={1000} rows={4}></CTextArea>
        </Form.Item>
        <br />
        <CTableUploadFile
          // showAction={actionType !== ActionType.VIEW}
          //                     onDownload={
          //                       actionType === ActionType.VIEW
          //                         ? handleDownloadFile
          //                         : undefined
          //                     }
          // disabled={actionType === ActionType.VIEW}
          acceptedFileTypes="
          application/pdf,
          image/jpg,
          image/png,
          application/msword,
          image/jpeg,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          // formName='files'
        ></CTableUploadFile>
      </Form>
    </CModal>
  );
};

export default ProgressModal;
