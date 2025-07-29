import { el } from '@faker-js/faker';
import CSelect from '@react/commons/Select';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import { useMemo } from 'react';

interface Props {
  index: number;
  defaultOption?: any[];
}

const CustomPaymentMethodSelect = ({ index, defaultOption }: Props) => {
  const form = Form.useFormInstance();
  const deliveryFees = Form.useWatch('deliveryFees', form);

  const options = useMemo(() => {
    const current =
      deliveryFees &&
      deliveryFees.find((item: any, idx: number) => item && index === idx);
    if (current) {
      const usedPaymentMethod = deliveryFees
        ?.filter(
          (item: any) =>
            item &&
            item.deliveryMethod === current?.deliveryMethod &&
            !!item.paymentMethod
        )
        .map((item: any) => item.paymentMethod) as any[];
      return (defaultOption || []).filter(
        (item) => !usedPaymentMethod.includes(item.value)
      );
    } else {
      return defaultOption;
    }
  }, [deliveryFees, index, defaultOption]);

  return (
    <Form.Item name={[index, 'paymentMethod']} rules={[validateForm.required]}>
      <CSelect
        showSearch={false}
        placeholder="Chọn phương thức thanh toán"
        options={options}
      />
    </Form.Item>
  );
};

export default CustomPaymentMethodSelect;
