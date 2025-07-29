import { CRadio, DebounceSelect } from '@react/commons/index';
import { ActionType } from '@react/constants/app';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Radio, Row } from 'antd';
import { useMutateOrders } from '../hooks/useGetOrderList';
import { useMutateProductList } from '../hooks/useGetProductList';
import { OrderType } from '../types';
import formInstance from '@react/utils/form';

export interface KitAddViewProps {
  actionType: ActionType;
}

const TypeOrder: React.FC<KitAddViewProps> = ({ actionType }) => {
  const form = Form.useFormInstance();
  const isViewType = actionType === ActionType.VIEW;
  const { isOrderd, orderNo } = Form.useWatch((e) => e, form) ?? {};
  const { mutateAsync: mutateOrders } = useMutateOrders();
  const { mutateAsync: mutateProductList } = useMutateProductList();
  const handleChangeType = () => {
    const values = form.getFieldsValue();
    const { isOrderd, ...restValues } = values;
    form.resetFields(Object.keys(restValues));
    form.setFieldsValue({
      products: [{}],
      isUsingFile: true,
    });
  };
  const handleSelectOrder = ({ orderNo, id, ...orderRest }: OrderType) => {
    handleClearOrder();
    if (!isOrderd) return;
    if (orderNo) {
      mutateProductList(
        { orderId: id },
        {
          onSuccess: (res) => {
            form.setFieldValue(
              'products',
              !res?.length
                ? [{}]
                : res.map(({ value, label, ...rest }: any) => rest)
            );
          },
        }
      );
    } else {
      form.setFieldValue('products', [{}]);
    }
  };
  const handleClearOrder = () => {
    ['stockId', 'orgId', 'fromSerial', 'profileType'].forEach((field) => {
      formInstance.resetFormError(form, [['products', 0, field]]);
    });
    form.setFieldsValue({ products: [{}] });
  };
  return (
    <div>
      <Card>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Ghép KIT"
              name="isOrderd"
              rules={[validateForm.required]}
            >
              <Radio.Group onChange={handleChangeType} disabled={isViewType}>
                <CRadio value={false}>Không theo đơn hàng</CRadio>
                <CRadio value={true}>Theo đơn hàng</CRadio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {isOrderd && (
            <>
              <Col span={12}>
                <Form.Item
                  name="orderNo"
                  label="Mã đơn hàng"
                  className="mb-0"
                  rules={[validateForm.required]}
                >
                  <DebounceSelect
                    placeholder="Nhập mã đơn hàng"
                    fetchOptions={mutateOrders}
                    disabled={isViewType}
                    labelInValue
                    onSelect={(value, option) =>
                      handleSelectOrder(option as OrderType)
                    }
                    onClear={handleClearOrder}
                    filter={{ orderNo: orderNo?.label }}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Card>
      <br />
    </div>
  );
};

export default TypeOrder;
