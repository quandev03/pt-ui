import { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CInput, CModal, CSelect } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Col, Flex, Form, Row } from 'antd';
import { useParameterQuery } from 'apps/Internal/src/hooks/useParameterQuery';
import { useFeeByOder, useSelectDVVC } from '../queryHook/useList';
import { IPayloadUpdateOrder, IResponseGetFee, ISelectDVVC } from '../types';
import { useEffect } from 'react';
import { formatCurrencyVND } from '@react/helpers/utils';

export interface Props {
  data: ISelectDVVC;
  onCancel: (value: boolean) => void;
  onConfirm: () => void;
}

const ModalSelectUnitAgain: React.FC<Props> = ({
  data,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm();
  const { data: optionDVVC } = useParameterQuery({
    'table-name': 'SALE_ORDER',
    'column-name': 'DELIVERY_PARTNER_CODE',
    enabled: true,
  });
  const partnerWatch = Form.useWatch('partner', form);
  const { data: feeByOrder } = useFeeByOder(
    data.data?.id ? String(data.data?.id) : '',
    partnerWatch
  );

  const { mutate: onSelectDVVC, isPending: isLoadingSelect } = useSelectDVVC(
    () => {
      onConfirm && onConfirm();
    }
  );

  const handleFinishForm = () => {
    if (data?.data) {
      const dataUpdate: IPayloadUpdateOrder = {
        id: data.data.id,
        address: data.data.address,
        customerEmail: data.data.customerEmail,
        customerName: data.data.customerName,
        customerPhone: data.data.customerPhone,
        deliveryMethod: data.data.deliveryMethod,
        deliveryPartner: partnerWatch,
        district: data.data.districtCode,
        ward: data.data.wardCode,
      };
      onSelectDVVC(dataUpdate);
    }
  };

  const handleCancel = () => {
    onCancel(false);
    form.resetFields();
  };

  useEffect(() => {
    if (data.isOpen && feeByOrder) {
      form.setFieldsValue({
        partnerDeliveryFee: formatCurrencyVND(feeByOrder.amount || 0),
      });
    }
  }, [data.isOpen, feeByOrder]);

  useEffect(() => {
    if (data.isOpen && data.data) {
      form.setFieldsValue({
        partner: data.data.deliveryPartnerCode,
        deliveryFee: formatCurrencyVND(data.data.deliveryFee || 0),
      });
    }
  }, [data.isOpen, data.data]);

  return (
    <CModal
      title={'Chọn lại ĐVVC'}
      open={data.isOpen}
      loading={false}
      width={800}
      onCancel={handleCancel}
      footer={[
        <Flex justify="end" className="w-full" gap={12}>
          <CButtonSave
            onClick={() => {
              form.submit();
            }}
            loading={isLoadingSelect}
          />
          <CButtonClose
            type="default"
            onClick={handleCancel}
            loading={isLoadingSelect}
          >
            Đóng
          </CButtonClose>
        </Flex>,
      ]}
    >
      <Form form={form} onFinish={handleFinishForm} labelCol={{ span: 8 }}>
        <Row gutter={[12, 16]}>
          <Col span={24}>
            <Form.Item
              name="partner"
              label="Đơn vị vận chuyển"
              required
              rules={[validateForm.required]}
            >
              <CSelect
                options={optionDVVC}
                filterOption={(input: any, option: any) =>
                  (option?.label?.toLowerCase() ?? '').includes(
                    input?.toLowerCase()
                  )
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                placeholder="Chọn đơn vị vận chuyển"
                defaultValue={undefined}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="deliveryFee" label="Giá vận chuyển">
              <CInput disabled={true} value={data?.data?.deliveryFee} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="partnerDeliveryFee"
              label="Cước vận chuyển thực tế"
            >
              <CInput
                disabled={true}
                value={(feeByOrder as IResponseGetFee)?.amount}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CModal>
  );
};

export default ModalSelectUnitAgain;
