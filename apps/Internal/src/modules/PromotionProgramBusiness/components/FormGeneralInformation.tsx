import CInput from '@react/commons/Input';
import CRadio from '@react/commons/Radio';
import CSwitch from '@react/commons/Switch';
import Show from '@react/commons/Template/Show';
import { Text } from '@react/commons/Template/style';
import { ActionType } from '@react/constants/app';
import { convertVietnameseToEnglish } from '@react/helpers/utils';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Radio, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useEffect } from 'react';
import { PromCodeMethods } from '../types';
interface FormGeneralInformationProps {
  typeModal: ActionType;
  checkPromCodeMethod: PromCodeMethods;
  handleDownloadFile: () => void;
}
export const FormGeneralInformation = ({
  typeModal,
  checkPromCodeMethod,
  handleDownloadFile,
}: FormGeneralInformationProps) => {
  const form = useFormInstance();
  const quantity = useWatch('quantity', form);
  const fromNumber = useWatch('fromNumber', form);
  const toNumber = useWatch('toNumber', form);
  const statusValue = useWatch('status', form);
  useEffect(() => {
    if (fromNumber && toNumber) {
      form.validateFields(['toNumber']);
    }
  }, [quantity, fromNumber, toNumber]);
  return (
    <Card>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            rules={[{ required: true, message: MESSAGE.G06 }]}
            label="Tên mã khuyến mại"
            name="promName"
          >
            <CInput maxLength={50} placeholder="Nhập tên mã khuyến mại" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lượng mã"
            name="quantity"
            rules={[
              validateForm.required,
              validateForm.minNumber(
                1,
                'Số lượng mã phải lớn hơn 0 và nhỏ hơn hoặc bằng 3000'
              ),
              validateForm.maxNumber(
                3000,
                'Số lượng mã phải lớn hơn 0 và nhỏ hơn hoặc bằng 3000'
              ),
            ]}
          >
            <CInput
              disabled={
                (typeModal !== ActionType.ADD &&
                  checkPromCodeMethod === PromCodeMethods.MANY_CODE) ||
                typeModal === ActionType.VIEW
              }
              maxLength={4}
              onlyNumber
              placeholder="Nhập số lượng mã"
            />
          </Form.Item>
        </Col>
        <Col
          span={
            checkPromCodeMethod === PromCodeMethods.MANY_CODE &&
            (typeModal === ActionType.VIEW || typeModal === ActionType.EDIT)
              ? 12
              : 24
          }
        >
          <Form.Item
            name="promCodeMethod"
            rules={[{ required: true }]}
            initialValue={PromCodeMethods.ONE_CODE}
          >
            <Radio.Group disabled={typeModal !== ActionType.ADD}>
              <CRadio value={PromCodeMethods.ONE_CODE}>
                <Text className="radio-label">Tạo mã lẻ</Text>
              </CRadio>
              <CRadio value={PromCodeMethods.MANY_CODE} className="ml-[62px]">
                <Text className="radio-label">Tạo nhiều mã</Text>
              </CRadio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Show.When
          isTrue={
            checkPromCodeMethod === PromCodeMethods.MANY_CODE &&
            (typeModal === ActionType.VIEW || typeModal === ActionType.EDIT)
          }
        >
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: MESSAGE.G06 }]}
              label={
                <span>
                  File mã khuyến mại
                  <span style={{ color: '#ff4d4f' }}> *</span>
                </span>
              }
            >
              <div
                className="text-[#005AAA] italic cursor-pointer !important"
                onClick={handleDownloadFile}
              >
                {form.getFieldValue('promCode') || 'defaultFileName'}
              </div>
            </Form.Item>
          </Col>
        </Show.When>
        <Show.When isTrue={checkPromCodeMethod === PromCodeMethods.ONE_CODE}>
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: MESSAGE.G06 }]}
              label="Nhập mã lẻ"
              name="promCode"
            >
              <CInput
                disabled={typeModal !== ActionType.ADD}
                onChange={(e) => {
                  let inputValue = e.target.value;
                  inputValue = inputValue.replace(/\s+/g, '');
                  inputValue = inputValue.replace(/[^\p{L}\d_]/gu, '');
                  form.setFieldsValue({
                    promCode: convertVietnameseToEnglish(inputValue),
                  });
                }}
                maxLength={20}
                placeholder="Nhập ký tự số và chữ hoặc dấu “_”"
              />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
        </Show.When>
        <Show>
          <Show.When isTrue={checkPromCodeMethod === PromCodeMethods.MANY_CODE}>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: MESSAGE.G06 }]}
                label="Tiền tố"
                name="prefixCode"
              >
                <CInput
                  disabled={typeModal !== ActionType.ADD}
                  preventSpecial
                  preventSpace
                  preventVietnamese
                  maxLength={20}
                  placeholder="Nhập tiền tố"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  validateForm.required,
                  validateForm.minNumber(1, 'Số random từ phải lớn hơn 0'),
                ]}
                label="Số random từ"
                name="fromNumber"
              >
                <CInput
                  type="number"
                  disabled={typeModal !== ActionType.ADD}
                  onlyNumber
                  maxLength={5}
                  placeholder="Nhập số random từ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  validateForm.minNumber(1, 'Số random đến phải lớn hơn 0'),
                  validateForm.required,
                  {
                    validator: (_, value) => {
                      const checkQuantity = value - fromNumber + 1 < quantity;
                      if (value && fromNumber && value <= fromNumber) {
                        return Promise.reject(
                          'Số random đến phải lớn hơn số random từ'
                        );
                      } else if (value && toNumber && checkQuantity) {
                        return Promise.reject(
                          'Dải số ngẫu nhiên ít hơn số lượng mã'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                label="Số random đến"
                name="toNumber"
              >
                <CInput
                  onBlur={(e) => e?.preventDefault()}
                  type="number"
                  disabled={typeModal !== ActionType.ADD}
                  onlyNumber
                  maxLength={5}
                  placeholder="Nhập số random đến"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hậu tố" name="suffixCode">
                <CInput
                  preventSpace
                  disabled={typeModal !== ActionType.ADD}
                  preventSpecial
                  preventVietnamese
                  maxLength={20}
                  placeholder="Nhập hậu tố"
                />
              </Form.Item>
            </Col>
          </Show.When>
        </Show>
        <Col span={12}>
          <Form.Item
            label={statusValue ? 'Hoạt động' : 'Không hoạt động'}
            name="status"
            valuePropName="checked"
            initialValue={true}
          >
            <CSwitch disabled={typeModal !== ActionType.EDIT} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
