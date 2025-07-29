import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { CNumberInput, CTable } from '@react/commons/index';
import { ActionType } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Col, Form, FormListFieldData } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { StoreValue } from 'antd/es/form/interface';
import { ColumnsType } from 'antd/es/table';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { FC, useMemo } from 'react';
import { RowStyle, StyleTableForm } from '../page/style';
import { useColumnsDiscountDetailLines } from '../queryHook/useColumns';
import { IDiscountDetail } from '../types';

type ConditionApplyItemType = {
  name: number;
  typeModal: ActionType;
  length: number;
  handleAdd: (defaultValue?: StoreValue, insertIndex?: number) => void;
  handleRemove: (index: number | number[]) => void;
};

const ConditionApplyItem: FC<ConditionApplyItemType> = ({
  name,
  typeModal,
  length,
  handleAdd,
  handleRemove,
}) => {
  const form = useFormInstance();
  const fromValue = useWatch(['discountDetails', name, 'fromValue'], form);
  const toValue = useWatch(['discountDetails', name, 'toValue'], form);

  const discountDetails: IDiscountDetail[] =
    useWatch(['discountDetails'], form) ?? [];

  const idsDiscountType = useMemo(() => {
    const currentBox = discountDetails[name];
    if (!currentBox) return [];
    return currentBox.discountDetailLines.map((item) =>
      String(item.discountType)
    );
  }, [discountDetails]);

  const disabledAdd = useMemo(() => {
    if (
      fromValue === undefined ||
      fromValue === '' ||
      toValue === undefined ||
      toValue === ''
    )
      return true;
    return false;
  }, [fromValue, toValue]);

  const {
    DISCOUNT_DETAIL_LINE_FORM_DISCOUNT = [],
    DISCOUNT_DETAIL_LINE_DISCOUNT_TYPE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const optionDiscountType = useMemo(() => {
    return DISCOUNT_DETAIL_LINE_DISCOUNT_TYPE.map((item) => ({
      ...item,
      disabled: idsDiscountType.includes(item.value as string),
    }));
  }, [DISCOUNT_DETAIL_LINE_DISCOUNT_TYPE, idsDiscountType]);

  const columns: ColumnsType<FormListFieldData> = useColumnsDiscountDetailLines(
    optionDiscountType,
    DISCOUNT_DETAIL_LINE_FORM_DISCOUNT,
    name,
    typeModal
  );

  return (
    <Col span={24} className="!px-6">
      <div className="flex gap-5">
        <RowStyle gutter={[24, 12]}>
          <Col span={12}>
            <Form.Item
              name={[name, 'fromValue']}
              label="Giá trị từ"
              rules={[
                validateForm.required,
                {
                  validator(rule, value, callback) {
                    const numberValue = Number(value);
                    const discountDetails: IDiscountDetail[] =
                      form.getFieldValue(['discountDetails']) ?? [];
                    const discountDetailsHasValueFormTo: [number, number][] =
                      discountDetails
                        .filter(
                          (item, index) =>
                            index !== name && item.fromValue && item.toValue
                        )
                        .map((item) => [item.fromValue, item.toValue]);
                    const isFail = discountDetailsHasValueFormTo.some(
                      (item) => item[0] <= numberValue && numberValue <= item[1]
                    );
                    if (isFail) {
                      return Promise.reject(
                        'Giá trị đến không được chồng chéo lên nhau'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              labelCol={{ flex: '95px' }}
              validateTrigger={['onBlur']}
            >
              <CNumberInput
                maxLength={11}
                placeholder="Nhập giá trị từ"
                disabled={typeModal === ActionType.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={[name, 'toValue']}
              dependencies={[['discountDetails', name, 'fromValue']]}
              labelCol={{ flex: '95px' }}
              required
              validateTrigger={['onBlur', 'onSubmit']}
              rules={[
                {
                  validator(_, toValue) {
                    const isFieldTouched = form.isFieldsTouched([
                      ['discountDetails', name, 'toValue'],
                    ]);
                    if (isFieldTouched && !toValue) {
                      return Promise.reject(MESSAGE.G06);
                    }

                    if (
                      fromValue &&
                      toValue &&
                      Number(fromValue) > Number(toValue)
                    ) {
                      return Promise.reject(
                        'Giá trị đến phải lớn hơn giá trị từ'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              label="Giá trị đến"
            >
              <CNumberInput
                maxLength={11}
                placeholder="Nhập giá trị đến"
                disabled={typeModal === ActionType.VIEW}
                onBlur={() => {
                  const isFieldTouched = form.isFieldsTouched([
                    ['discountDetails', name, 'toValue'],
                  ]);
                  if (!isFieldTouched) {
                    form.setFields([
                      {
                        name: ['discountDetails', name, 'toValue'],
                        touched: true,
                      },
                    ]);
                  }
                  const discountDetails: IDiscountDetail[] =
                    form.getFieldValue(['discountDetails']) ?? [];
                  discountDetails.forEach((item, index) => {
                    if (index !== name) {
                      form.validateFields([
                        ['discountDetails', index, 'fromValue'],
                      ]);
                    }
                  });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.List name={[name, 'discountDetailLines']}>
              {(fields, { add, remove }) => (
                <CTable
                  dataSource={fields}
                  columns={
                    columns.map((col) => {
                      if (col.key === 'action') {
                        return {
                          ...col,
                          render: (_: any, record: any, index: number) => {
                            if (ActionType.VIEW === typeModal) {
                              return null;
                            }
                            return (
                              <div className="flex justify-start ml-3 items-center h-full">
                                {fields.length - 1 > 0 && (
                                  <MinusOutlined
                                    onClick={() => remove(index)}
                                    className="cursor-pointer mt-1"
                                    style={{ marginRight: '16px' }}
                                  />
                                )}
                                {fields.length <
                                  DISCOUNT_DETAIL_LINE_FORM_DISCOUNT.length && (
                                  <PlusOutlined
                                    onClick={() => {
                                      const currentBox = discountDetails[name];
                                      if (currentBox) {
                                        add({
                                          discountType: null,
                                          formDiscount: null,
                                          discountValue: '',
                                        });
                                      }
                                    }}
                                    className="cursor-pointer mt-1"
                                  />
                                )}
                              </div>
                            );
                          },
                        };
                      }
                      return col;
                    }) as any
                  }
                  pagination={false}
                  rowKey="key"
                  rowClassName="align-top"
                />
              )}
            </Form.List>
          </Col>
        </RowStyle>
        {ActionType.VIEW !== typeModal && (
          <div className="flex gap-5 justify-start items-start min-w-16">
            {length - 1 > 0 && (
              <MinusOutlined
                onClick={() => {
                  handleRemove(name);
                }}
                className="cursor-pointer mt-3"
              />
            )}
            {length - 1 === name && (
              <PlusOutlined
                onClick={() => {
                  if (!disabledAdd) {
                    const discountDetailsCurrent: IDiscountDetail =
                      form.getFieldValue(['discountDetails', name]) ?? {
                        fromValue: 0,
                        toValue: 0,
                        discountDetailLines: [],
                      };

                    handleAdd({
                      key: 0,
                      fromValue: Number(discountDetailsCurrent.toValue) + 1,
                      toValue: '',
                      discountDetailLines:
                        discountDetailsCurrent.discountDetailLines.map(
                          (item) => ({
                            ...item,
                            discountValue: '',
                            id: undefined,
                            discountDetailId: undefined,
                          })
                        ),
                    });
                  }
                }}
                className={`mt-3 ${
                  disabledAdd ? '!cursor-not-allowed' : 'cursor-pointer'
                }`}
              />
            )}
          </div>
        )}
      </div>
    </Col>
  );
};
export default ConditionApplyItem;
