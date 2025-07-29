import { TitleHeader } from '@react/commons/Template/style';
import { Col, Form, Row, Spin } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useGetDeliveryPartner } from '../hooks/useGetDeliveryPartner';
import CSelect from '@react/commons/Select';
import { CButtonEdit, CButtonSave } from '@react/commons/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateDeliveryPartner } from '../hooks/useCreateDeliveryPartner';
import validateForm from '@react/utils/validator';

const ShippingConfigurationsPage = () => {
  const [form] = Form.useForm();
  const { data: deliveryPartners, isLoading } = useGetDeliveryPartner();
  const [searchParams, setSearchParams] = useSearchParams();
  const actionMode = searchParams.get('actionMode') ?? 'view';
  const navigate = useNavigate();

  const { mutate: createDeliveryPartner, isPending } = useCreateDeliveryPartner(
    () => {
      navigate(-1);
    }
  );

  useEffect(() => {
    if (deliveryPartners) {
      const defaultDeliveryPartner = deliveryPartners.find(
        (item) => !!item.isDefault
      );
      if (defaultDeliveryPartner) {
        form.setFieldsValue({
          partner: defaultDeliveryPartner.code,
        });
      }
    }
  }, [deliveryPartners]);

  const deliveryPartnerOptions = useMemo(() => {
    if (!deliveryPartners) return [];
    return deliveryPartners?.map((item) => ({
      label: item.value,
      value: item.code,
    }));
  }, [deliveryPartners]);

  const handleFinish = useCallback((values: { partner: string }) => {
    const payload = {
      partner: values.partner,
    };
    createDeliveryPartner(payload);
  }, []);
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>Cấu hình đơn vị vận chuyển mặc định</TitleHeader>
      <Spin spinning={isLoading || isPending}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelCol={{ span: 5 }}
          labelWrap={true}
          validateTrigger={['onSubmit']}
          colon={false}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  name="partner"
                  label="Đơn vị vận chuyển"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    options={deliveryPartnerOptions}
                    disabled={actionMode === 'view'}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="flex justify-end mt-4">
            {actionMode === 'view' ? (
              <CButtonEdit
                onClick={() => {
                  setSearchParams({ actionMode: 'edit' });
                }}
              />
            ) : (
              <CButtonSave htmlType="submit" disabled={isPending} />
            )}
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default ShippingConfigurationsPage;
