import {
  CModal,
  CSelect,
  CTextArea,
  NotificationSuccess,
} from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { scrollErrorField } from 'apps/Internal/src/modules/ActivateSubscription/components/CheckOtp';
import { useChangeSimUpdate } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useChangeSimUpdate';
import { ReasonChangeSimEnum } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useGenContractChangeSim';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';
import { useNavigate } from 'react-router-dom';

const ReasonModal = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const rejectReasonCode = Form.useWatch('rejectReasonCode', form);
  const { isOpenModalReason, formAntd, setOpenModalReason, dataRejectForm } =
    useStoreListOfRequestsChangeSim();
  const { data: dataReason } = useReasonCustomerService('CHANGE_SIM_REJECT');
  const { mutate: mutateChangeSimUpdate, isPending: isPendingChangeSimUpdate } =
    useChangeSimUpdate();

  const handleFinish = (values: any) => {
    const dataForm = formAntd.getFieldsValue();
    mutateChangeSimUpdate(
      {
        simChangeRequestData: {
          id: dataForm.contractId,
          requestSimType: dataForm.simType,
          newSerial: dataForm.serial,
          reasonCode: dataForm.reason,
          receiverName: dataForm.receiverName,
          phoneNumber: dataForm.receiverPhone ?? dataRejectForm.receiverPhone,
          deliveryMethod: dataForm.deliveryMethod ?? dataRejectForm.deliveryMethod,
          receiverAddress: dataForm.receiverAddress ?? dataRejectForm.receiverAddress,
          receiverProvince: dataForm.receiverProvince ?? dataRejectForm.receiverProvince,
          rejectReasonCode: values.rejectReasonCode,
          note: values.note,
          receiptMethod: dataForm.receiptMethod ?? dataRejectForm.receiptMethod,
          storeAddress: dataForm.storeAddress ?? dataRejectForm.storeAddress,
          stockId: dataForm.stockId,
          lpaData: dataForm.lpaData
        },
      },
      {
        onSuccess: () => {
          NotificationSuccess('Từ chối yêu cầu đổi SIM online thành công');
          setTimeout(() => {
            handleCancel();
            navigate(-1);
          }, 2000);
        },
      }
    );

    scrollErrorField();
  };


  const handleCancel = () => {
    setOpenModalReason(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpenModalReason}
      title={'Từ chối đổi SIM online'}
      okText="Từ chối"
      confirmLoading={isPendingChangeSimUpdate}
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Lý do từ chối"
          name="rejectReasonCode"
          rules={[validateForm.required]}
        >
          <CSelect
            placeholder="Chọn lý do"
            options={dataReason}
            disabled={false}
            fieldNames={{ label: 'name', value: 'code' }}
            optionRender={(oriOption) =>
              oriOption.label + '(' + oriOption.value + ')'
            }
          />
        </Form.Item>
        {rejectReasonCode === ReasonChangeSimEnum.other && (
          <Form.Item
            label="Ghi chú"
            name="note"
            rules={[validateForm.required]}
          >
            <CTextArea maxLength={200} rows={4} disabled={false}></CTextArea>
          </Form.Item>
        )}
      </Form>
    </CModal>
  );
};

export default ReasonModal;
