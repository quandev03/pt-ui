import { Form } from 'antd';
import { ImpactType, ModalProps } from '../types';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  CUploadFileTemplate,
  NotificationSuccess,
} from '@react/commons/index';
import { useImpactByFileMutation } from '../hooks/useImpactByFileMutation';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { prefixCustomerService } from '@react/url/app';

const ImpactByFileModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const impactType = Form.useWatch('actionCode', form);
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { data: impactTypeData } = useGetApplicationConfig(
    'SUB_ACTION',
    isOpen
  );
  const { data: reasonData } = useReasonCustomerService(impactType, isOpen);
  const { isPending: isPendingExport, mutate: exportMutate } =
    useExportMutation();
  const { isPending, mutate } = useImpactByFileMutation(form);

  const handleFinish = ({ actionFile, ...values }: any) => {
    const isBlock = values.actionCode === ImpactType.BLOCK_ACTION;
    CModalConfirm({
      message: `Bạn có chắc chắn muốn ${
        isBlock ? 'cấm' : 'mở'
      } tác động thuê bao này?`,
      onOk: () =>
        mutate(
          { metaData: values, actionFile },
          {
            onSuccess: () => {
              handleCancel();
              NotificationSuccess(
                'Tải file lên thành công. Hệ thống đang xử lý, vui lòng chờ'
              );
            },
          }
        ),
    });
  };

  const handleDownloadTemplate = () => {
    exportMutate({
      uri: `${prefixCustomerService}/file/customer-management/template/cam_mo_thue_bao_mau.xlsx`,
      filename: 'file_cam_mo_thue_bao_mau.xlsx',
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Cấm/Mở tác động thuê bao theo file"
      okText="Thực hiện"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isPendingExport || isPending}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        colon={false}
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
                [ImpactType.BLOCK_ACTION, ImpactType.OPEN_ACTION].includes(
                  item.code as ImpactType
                )
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
            name="reasonNote"
            rules={[validateForm.required]}
          >
            <CTextArea placeholder="Nhập lý do khác" maxLength={200} />
          </Form.Item>
        )}
        <Form.Item label="Mô tả" name="description">
          <CTextArea placeholder="Nhập mô tả" maxLength={200} />
        </Form.Item>
        <CUploadFileTemplate
          label="Chọn file"
          name="actionFile"
          required
          accept={[
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ]}
          onDownloadTemplate={handleDownloadTemplate}
        />
      </Form>
    </CModal>
  );
};

export default ImpactByFileModal;
