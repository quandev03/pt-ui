import { CInputNumber, CNumberInput } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { Text } from '@react/commons/Template/style';
import { handlePasteRemoveTextKeepNumber } from '@react/helpers/utils';
import validateForm from '@react/utils/validator';
import { Form, FormListFieldData } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ColumnsType } from 'antd/es/table';
import { IOption } from 'apps/Internal/src/components/layouts/types';
import { FormDiscountEnum } from '../constants';
import { ActionType } from '@react/constants/app';

export const useColumnsDiscountDetailLines = (
  optionDiscountType: IOption[],
  DISCOUNT_DETAIL_LINE_FORM_DISCOUNT: IOption[],
  name: number,
  typeModal: ActionType
): ColumnsType<FormListFieldData> => {
  const form = useFormInstance();
  return [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: '5%',
      render(_: any, __: any, index: number) {
        return <Text className="mt-1.5">{index + 1}</Text>;
      },
    },
    {
      title: 'Loại chiết khấu',
      dataIndex: 'discountType',
      key: 'discountType',
      width: '30%',
      render: (_, record) => {
        return (
          <Form.Item
            name={[record.name, 'discountType']}
            validateTrigger={'onBlur'}
            className="mb-0"
            rules={[validateForm.required]}
          >
            <CSelect
              options={optionDiscountType}
              placeholder="Chọn loại chiết khấu"
              allowClear={false}
              showSearch={false}
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Hình thức chiết khấu',
      dataIndex: 'formDiscount',
      key: 'formDiscount',
      width: '30%',
      render: (_, record) => (
        <Form.Item
          name={[record.name, 'formDiscount']}
          className="mb-0 w-full"
          validateTrigger={'onBlur'}
          rules={[validateForm.required]}
        >
          <CSelect
            options={DISCOUNT_DETAIL_LINE_FORM_DISCOUNT}
            placeholder="Chọn hình thức chiết khấu"
            allowClear={false}
            showSearch={false}
            onChange={() => {
              form.validateFields([
                [
                  'discountDetails',
                  name,
                  'discountDetailLines',
                  record.name,
                  'discountValue',
                ],
              ]);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Giá trị chiết khấu',
      dataIndex: 'discountValue',
      key: 'discountValue',
      width: '30%',
      render: (_, record) => {
        const formDiscount = form.getFieldValue([
          'discountDetails',
          name,
          'discountDetailLines',
          record.name,
          'formDiscount',
        ]);
        return (
          <Form.Item
            name={[record.name, 'discountValue']}
            rules={[
              validateForm.required,
              {
                validator(rule, value, callback) {
                  const formDiscount = form.getFieldValue([
                    'discountDetails',
                    name,
                    'discountDetailLines',
                    record.name,
                    'formDiscount',
                  ]);
                  if (
                    formDiscount &&
                    formDiscount === FormDiscountEnum.PERCENTAGE &&
                    value &&
                    (Number(value) > 100 || Number(value) < 0)
                  ) {
                    return Promise.reject(
                      'Giá trị chiết khấu phải từ 0 đến 100'
                    );
                  }
                  if (
                    formDiscount &&
                    formDiscount === FormDiscountEnum.MONEY &&
                    value &&
                    (Number(value) > 99999999999 || Number(value) < 0)
                  ) {
                    return Promise.reject(
                      'Giá trị chiết khấu phải từ 0 đến 99999999999'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {formDiscount === FormDiscountEnum.MONEY ? (
              <CNumberInput
                placeholder="Nhập giá trị chiết khấu"
                disabled={typeModal === ActionType.VIEW}
                addonAfter="VNĐ"
              />
            ) : (
              <CInputNumber
                max={100}
                precision={2}
                placeholder="Nhập giá trị chiết khấu"
                disabled={typeModal === ActionType.VIEW}
                controls={false}
                addonAfter="%"
                onPaste={(e) => {
                  const nameDiscountValue = [
                    'discountDetails',
                    name,
                    'discountDetailLines',
                    record.name,
                    'discountValue',
                  ];
                  const value = handlePasteRemoveTextKeepNumber(e, 11);
                  form.setFieldValue(nameDiscountValue, value);
                  form.validateFields(nameDiscountValue);
                }}
              />
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'action',
      width: '5%',
    },
  ];
};
