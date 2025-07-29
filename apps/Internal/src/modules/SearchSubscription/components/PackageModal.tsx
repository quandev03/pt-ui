import { Form } from 'antd';
import { ModalProps, ImpactType } from '../types';
import validateForm from '@react/utils/validator';
import {
  CModal,
  CModalConfirm,
  CSelect,
  CTextArea,
  NotificationSuccess,
} from '@react/commons/index';
import { usePackageRegisQuery } from '../hooks/usePackageRegisQuery';
import useSubscriptionStore from '../store';
import { usePackageMutation } from '../hooks/usePackageMutation';
import { useReasonCustomerService } from 'apps/Internal/src/hooks/useReasonList';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useCancelPackageMutation } from '../hooks/useCancelPackageMutation';

const PackageModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { subscriberId, setSubscriberId } = useSubscriptionStore();
  const impactType = Form.useWatch('actionCode', form);
  const isShowReason = Form.useWatch('reasonCode', form) === 'OTHER';
  const { data: impactTypeData, isLoading: isLoadingImpactTypeData } =
    useGetApplicationConfig('SUB_ACTION');
  const { data: packageRegisData, isLoading: isLoadingPackageRegisData } =
    usePackageRegisQuery(subscriberId, impactType);
  const { data: reasonData } = useReasonCustomerService(
    impactType,
    !!impactType && isOpen
  );
  const { isPending, mutate } = usePackageMutation();
  const { isPending: isPendingCancel, mutate: cancelMutate } =
    useCancelPackageMutation();

  const handleFinish = (values: any) => {
    const isRegister = values.actionCode === ImpactType.REGISTER_PACKAGE;
    CModalConfirm({
      message: `Bạn có chắc chắn muốn ${
        isRegister ? 'đăng ký' : 'hủy'
      } gói cước này?`,
      onOk: () => {
        const packageObj = JSON.parse(values.packageObj);
        const newValues = { ...values, ...packageObj, subId: subscriberId };
        delete newValues.packageObj;

        mutate(newValues, {
          onSuccess: () => handleSuccess(isRegister),
          onError: (error) => {
            if (error?.errors?.length) {
              const packages = error.errors[0].detail;
              CModalConfirm({
                message: `Gói cước này không được đi kèm với gói cước ${packages}. Để đăng ký, bạn có xác nhận hủy gói cước ${packages}?`,
                onOk: () => {
                  const payload = packages.split(',').map((item) => ({
                    ...newValues,
                    actionCode: ImpactType.CANCEL_PACKAGE,
                    packageCode: item,
                  }));
                  payload.push(newValues);

                  cancelMutate(payload, {
                    onSuccess: () => handleSuccess(isRegister),
                  });
                },
              });
            }
          },
        });
      },
    });
  };

  const handleSuccess = (isRegister: boolean) => {
    handleCancel();
    NotificationSuccess(
      `${isRegister ? 'Đăng ký' : 'Hủy'} gói cước thành công`
    );
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setSubscriberId('');
  };

  return (
    <CModal
      open={isOpen}
      title="Đăng ký/Hủy gói cước"
      okText="Thực hiện"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      okButtonProps={{ disabled: isPending || isPendingCancel }}
      loading={isPending || isPendingCancel}
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
                [
                  ImpactType.REGISTER_PACKAGE,
                  ImpactType.CANCEL_PACKAGE,
                ].includes(item.code as ImpactType)
              )
              ?.map((item) => ({
                label: item.name,
                value: item.code,
              }))}
            onChange={() => form.resetFields(['packageObj', 'reasonCode'])}
            loading={isLoadingImpactTypeData}
          />
        </Form.Item>
        <Form.Item
          label="Gói cước"
          name="packageObj"
          rules={[validateForm.required]}
        >
          <CSelect
            placeholder="Chọn gói cước"
            options={packageRegisData}
            isLoading={isLoadingPackageRegisData}
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
      </Form>
    </CModal>
  );
};

export default PackageModal;
