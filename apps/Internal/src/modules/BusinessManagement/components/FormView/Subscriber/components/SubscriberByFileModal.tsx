import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  CUploadFileTemplate,
  NotificationSuccess,
} from '@react/commons/index';
import CCheckbox from '@react/commons/Checkbox';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useParams } from 'react-router-dom';
import { ModalProps } from '../types';
import { ImpactType } from 'apps/Internal/src/modules/SearchSubscription/types';
import { useSubscriberByFileMutation } from '../hooks/useSubscriberByFileMutation';
import { mapImpactTypeToText } from './SubscriberModal';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { prefixCustomerService } from '@react/url/app';
import { useQueryClient } from '@tanstack/react-query';

const SubscriberByFileModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const impactType = Form.useWatch('actionCode', form);
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const isShowMessage = Form.useWatch('isMessage', form);
  const { data: impactTypeData } = useGetApplicationConfig('SUB_ACTION');
  const { data: reasonData } = useReasonCustomerService(
    impactType,
    isOpen && !!impactType
  );
  const { isPending: isPendingExport, mutate: exportMutate } =
    useExportMutation();
  const { isPending, mutate } = useSubscriberByFileMutation(form);

  const handleFinish = ({ file, isMessage, ...values }: any) => {
    const newValues = { metaData: { ...values, enterpriseId: id }, file };
    const text = mapImpactTypeToText(values.actionCode);

    CModalConfirm({
      message: `Bạn có chắc chắn muốn ${text} thuê bao này?`,
      onOk: () =>
        mutate(newValues, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['GET_LIST_SUBSCRIBER_ENTERPRISE'],
            });
            handleCancel();
            NotificationSuccess(
              `Hệ thống đang xử lý ${text} danh sách thuê bao. Vui lòng theo dõi kết quả tại màn báo cáo tác động thuê bao theo file KHDN`
            );
          },
        }),
    });
  };

  const handleDownloadTemplate = () => {
    exportMutate({
      uri: `${prefixCustomerService}/file/customer-management/template/chan_mo_thue_bao_mau.xlsx`,
      filename: 'file_chan_mo_thue_bao_mau.xlsx',
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Chặn/Mở thuê bao theo file"
      okText="Thực hiện"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isPendingExport || isPending}
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
        <CUploadFileTemplate
          label="Tải file"
          name="file"
          required
          accept={[
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ]}
          onDownloadTemplate={handleDownloadTemplate}
        />
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

export default SubscriberByFileModal;
