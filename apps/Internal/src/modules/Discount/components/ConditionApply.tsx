import { ActionType } from '@react/constants/app';
import { Col, Form, Radio } from 'antd';
import { RowStyle } from 'apps/Internal/src/modules/Discount/page/style';
import { FC } from 'react';
import { CalTypeEnum } from '../constants';
import ConditionApplyItem from './ConditionApplyItem';

type Props = {
  typeModal: ActionType;
};

const ConditionApply: FC<Props> = ({ typeModal }) => {
  return (
    <RowStyle gutter={[24, 0]} className="relative">
      <h3 className="title-blue absolute -top-4 left-2 text-xl bg-white">
        Chi tiết chiết khấu
      </h3>
      <Col span={24}>
        <Form.Item name="calType" label="Điều kiện áp dụng">
          <Radio.Group>
            <Radio value={CalTypeEnum.TOTAL_ORDER_AMOUNT}>
              Tổng tiền đơn hàng
            </Radio>
            <Radio value={CalTypeEnum.NUMBER_OF_PRODUCTS}>
              Số lượng sản phẩm
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Col>

      <Form.List name="discountDetails">
        {(fields, { add, remove }) => {
          return fields.map((field) => (
            <ConditionApplyItem
              key={field.key}
              name={field.name}
              typeModal={typeModal}
              handleAdd={add}
              handleRemove={remove}
              length={fields.length}
            />
          ));
        }}
      </Form.List>
    </RowStyle>
  );
};

export default ConditionApply;
