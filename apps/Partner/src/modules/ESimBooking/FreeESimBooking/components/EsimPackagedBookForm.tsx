import {
  AnyElement,
  CInputNumber,
  CSelect,
  IModeAction,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { memo } from 'react';
import { useLogicActionPackagedEsim } from '../pages/ActionPackagedEsim/useLogicActionPackagedEsim';
import { useGetPackageCodes } from '../hooks/usePackageCodes';
import { Minus, Plus } from 'lucide-react';

const BookPackagedEsimForm = () => {
  const { data: packageCodeList } = useGetPackageCodes();
  const { actionMode } = useLogicActionPackagedEsim();

  const packageOptions =
    packageCodeList?.map((pkg) => ({
      key: pkg.id,
      value: pkg.pckCode,
      label: pkg.pckCode,
    })) || [];

  return (
    <Form.List
      name="packages"
      initialValue={[
        {
          quantity: null,
          freePackageCode: undefined,
          paidPackageCode: undefined,
        },
      ]}
    >
      {(fields, { add, remove }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {fields.map((field, index) => (
            <Row
              key={field.key}
              gutter={[15, 1]}
              style={{ alignItems: 'center' }}
            >
              {/* === Quantity Input === */}
              <Col span={7}>
                <Form.Item
                  {...field}
                  label="Số lượng eSIM"
                  name={[field.name, 'quantity']}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 16 }}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số lượng!' },
                    {
                      type: 'number',
                      max: 9999999999,
                      message: 'Tối đa 10 chữ số',
                    },
                    {
                      type: 'number',
                      min: 1,
                      message: 'Số lượng phải lớn hơn 0',
                    },
                  ]}
                >
                  <CInputNumber
                    placeholder="Nhập số lượng"
                    disabled={actionMode === IModeAction.READ}
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: AnyElement) =>
                      value.replace(/\$\s?|(,*)/g, '')
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  {...field}
                  label="Gói cước miễn phí"
                  name={[field.name, 'freePackageCode']}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 16 }}
                >
                  <CSelect
                    placeholder="Chọn gói cước"
                    disabled={actionMode === IModeAction.READ}
                    options={packageOptions}
                    allowClear
                  />
                </Form.Item>
              </Col>

              {/* === Paid Package Select === */}
              <Col span={6}>
                <Form.Item
                  {...field}
                  label="Gói cước có phí"
                  name={[field.name, 'paidPackageCode']}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 16 }}
                  rules={[
                    { required: true, message: 'Vui lòng chọn gói cước!' },
                  ]}
                >
                  <CSelect
                    placeholder="Chọn gói cước"
                    disabled={actionMode === IModeAction.READ}
                    options={packageOptions}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={1} />
              <Col
                span={1}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {/* Show Minus icon on every row except the first one */}
                {fields.length > 1 && (
                  <Minus
                    className="cursor-pointer"
                    size={24}
                    onClick={() => remove(field.name)}
                  />
                )}
              </Col>
              <Col
                span={1}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {index === fields.length - 1 && (
                  <Plus
                    className="cursor-pointer"
                    size={24}
                    onClick={() => add()}
                  />
                )}
              </Col>
            </Row>
          ))}
        </div>
      )}
    </Form.List>
  );
};

export default memo(BookPackagedEsimForm);
