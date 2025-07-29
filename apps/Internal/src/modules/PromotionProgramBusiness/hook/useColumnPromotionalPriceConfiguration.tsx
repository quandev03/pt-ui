import { CNumberInput } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import Show from '@react/commons/Template/Show';
import { AnyElement, ParamsOption } from '@react/commons/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { Form, FormInstance } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { PromotionProductType } from '../types';
import { ActionType } from '@react/constants/app';
import { useMemo } from 'react';

// Component riêng để xử lý promotion value cell
const PromotionValueCell = ({
  form,
  index,
  typeModal,
}: {
  form: FormInstance;
  index: number;
  typeModal: ActionType;
}) => {
  const checkPromotionType = Form.useWatch(
    ['promotionProgramLines', index, 'promotionType'],
    form
  );

  return (
    <>
      <Show.When isTrue={checkPromotionType === PromotionProductType.PRICE}>
        <Form.Item
          label=""
          name={[
            'promotionProgramLines',
            index,
            'promotionValuePromotionProgramLine',
          ]}
        >
          <CNumberInput
            disabled={typeModal === ActionType.VIEW}
            maxLength={11}
            placeholder="Nhập giá trị khuyến mại"
            addonAfter="VND"
          />
        </Form.Item>
      </Show.When>
      <Show.When isTrue={checkPromotionType === PromotionProductType.PERCENT}>
        <Form.Item
          label=""
          name={[
            'promotionProgramLines',
            index,
            'promotionValuePromotionProgramLine',
          ]}
        >
          <CInput
            disabled={typeModal === ActionType.VIEW}
            allowClear={false}
            onKeyDown={(e) => {
              const key = e.key;
              const allowedKeys = [
                'Backspace',
                'ArrowLeft',
                'ArrowRight',
                'Delete',
                'Tab',
              ];
              const currentValue = form.getFieldValue([
                'promotionProgramLines',
                index,
                'promotionValuePromotionProgramLine',
              ]);
              if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
                e.preventDefault();
                return;
              }
              const newValue =
                key === 'Backspace'
                  ? currentValue.slice(0, -1)
                  : currentValue + key;

              if (Number(newValue) > 100) {
                e.preventDefault();
              }
            }}
            addonAfter={
              <span
                style={{ cursor: 'pointer' }}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              >
                %
              </span>
            }
            maxLength={3}
            placeholder="Nhập giá trị khuyến mại"
          />
        </Form.Item>
      </Show.When>
    </>
  );
};

export const useColumnPromotionalPriceConfiguration = (
  form: FormInstance,
  typeModal: ActionType
): ColumnsType<AnyElement> => {
  const { PROMOTION_PROGRAM_LINE_PROMOTION_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  return useMemo(() => {
    return [
      {
        title: 'STT',
        dataIndex: 'stt',
        width: 30,
        render: (_, __, index: number) => index + 1,
      },
      {
        title: (
          <span>
            Sản phẩm <b className="text-red-500">*</b>
          </span>
        ),
        dataIndex: 'promotionProduct',
        width: 200,
        render: (_: string, record: AnyElement, index: number) => {
          return (
            <Form.Item
              name={['promotionProgramLines', index, 'promotionProduct']}
            >
              <CInput disabled />
            </Form.Item>
          );
        },
      },
      {
        title: 'Loại khuyến mại',
        dataIndex: 'promotionType',
        width: 200,
        render: (_: string, _record: AnyElement, index: number) => {
          return (
            <Form.Item name={['promotionProgramLines', index, 'promotionType']}>
              <CSelect
                disabled={typeModal !== ActionType.ADD}
                placeholder="Chọn loại khuyến mại"
                options={PROMOTION_PROGRAM_LINE_PROMOTION_TYPE.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
                allowClear={false}
                onKeyDown={(e) => {
                  if (e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          );
        },
      },
      {
        title: 'Giá trị khuyến mại',
        dataIndex: 'promotionValuePromotionProgramLine',
        width: 200,
        render: (_: string, _record: AnyElement, index: number) => {
          return (
            <PromotionValueCell
              form={form}
              index={index}
              typeModal={typeModal}
            />
          );
        },
      },
    ];
  }, [PROMOTION_PROGRAM_LINE_PROMOTION_TYPE, typeModal]);
};
