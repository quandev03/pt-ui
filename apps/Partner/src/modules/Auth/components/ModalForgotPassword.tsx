import CInput from '@react/commons/Input';
import CModal from '@react/commons/Modal';
import { IFieldErrorsItem } from '@react/commons/types';
import { Button, Col, Form, Row } from 'antd';
import { cleanUpPhoneNumber } from 'apps/Partner/src/helpers';
import { FocusEvent } from 'react';
import { useSupportInitForgotPassword } from '../queryHooks';
import { IInitPayload } from '../types';
import { emailRegex } from '@react/constants/regex';

type Props = {
  open: boolean;
  onClose: () => void;
};

const ModalForgotPassword = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();
  const { mutate: initForgotPassword } = useSupportInitForgotPassword(
    (fieldErrors) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    }
  );
  const handleBlur = (e: FocusEvent<HTMLInputElement>, field: string) => {
    form.setFieldValue(field, e.target.value.trim());
    form.validateFields([field]);
  };

  const handlePates = async (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = (e.target as HTMLInputElement).value;
    form.setFieldValue(field, value.trim());
  };

  const handleFinish = (values: IInitPayload) => {
    initForgotPassword({
      ...values,
      callbackUri: `/#/forgot-password?token=`,
    });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <CModal
      title={'Quên mật khẩu?'}
      open={open}
      width={600}
      onCancel={handleClose}
      footer={null}
    >
      <div>
        <div className="font-bold text-2xl text-center mb-6">
          Vui lòng nhập email lấy lại mật khẩu.
        </div>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          onFinish={handleFinish}
          validateTrigger={['onSubmit', 'onFinish']}
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                label={<div className="font-bold">Mã đối tác</div>}
                name="clientIdentity"
                required
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject('Không được để trống trường này');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <CInput
                  onBlur={(e) => {
                    handleBlur(e, 'clientIdentity');
                  }}
                  onPaste={(e) => {
                    handlePates(e, 'clientIdentity');
                  }}
                  className="login-form__input"
                  placeholder={'Nhập mã đối tác'}
                  maxLength={5}
                  onInput={(e: any) =>
                    (e.target.value = cleanUpPhoneNumber(
                      e.target.value
                    ).toUpperCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<div className="font-bold">Email</div>}
                name="email"
                required
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject('Không được để trống trường này');
                      } else if (!emailRegex.test(value)) {
                        return Promise.reject('Email không đúng định dạng');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <CInput
                  placeholder="Nhập email"
                  onBlur={(e) => {
                    handleBlur(e, 'email');
                  }}
                  maxLength={100}
                  onInput={(e: any) =>
                    (e.target.value = cleanUpPhoneNumber(e.target.value))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24} className="mt-3">
              <div className="flex gap-4 justify-center">
                <Button className="min-w-[120px]" onClick={handleClose}>
                  Hủy bỏ
                </Button>
                <Button
                  className="min-w-[120px]"
                  type="primary"
                  htmlType="submit"
                >
                  Tiếp tục
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </CModal>
  );
};

export default ModalForgotPassword;
