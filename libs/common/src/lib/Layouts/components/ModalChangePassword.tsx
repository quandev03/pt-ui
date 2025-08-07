import { useMutation } from '@tanstack/react-query';
import {
  AnyElement,
  CModal,
  IErrorResponse,
  IUserInfo,
  NotificationSuccess,
  cleanUpPhoneNumber,
  passwordRegex,
  setFieldError,
} from '@vissoft-react/common';
import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';

export type PayloadType = {
  newPwd: string;
  oldPwd: string;
  username: string;
};

interface IModalChangePasswordProps {
  userLogin: IUserInfo | null;
  showChangePassModal: boolean;
  setShowChangePassModal: (value: boolean) => void;
  logoutStore: () => void;
  fetcherChangePassword: (payload: PayloadType) => Promise<unknown>;
}

export const ModalChangePassword = ({
  userLogin,
  showChangePassModal,
  setShowChangePassModal,
  logoutStore,
  fetcherChangePassword,
}: IModalChangePasswordProps) => {
  const [form] = Form.useForm();

  const handlePates = async (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = (e.target as HTMLInputElement).value;
    form.setFieldValue(field, cleanUpPhoneNumber(value.trim()));
    form.validateFields([field]);
  };

  const { mutate: updatePassword, isPending: loadingUpdatePass } = useMutation({
    mutationFn: fetcherChangePassword,
    onSuccess: () => {
      NotificationSuccess('Đổi mật khẩu thành công');
      form.resetFields();
      if (showChangePassModal) {
        setShowChangePassModal(false);
      }
      logoutStore();
    },
    onError: (error: IErrorResponse) => {
      if (error.errors) {
        setFieldError(form, error.errors);
      }
    },
  });

  const handleFinish = (values: PayloadType) => {
    updatePassword({
      newPwd: values.newPwd,
      oldPwd: values.oldPwd,
      username: userLogin?.username ?? '',
    });
  };
  const handleClose = () => {
    setShowChangePassModal(false);
    form.resetFields();
  };
  return (
    <CModal
      title={
        userLogin?.needChangePassword
          ? 'Vui lòng đổi mật khẩu để tiếp tục sử dụng hệ thống'
          : 'Đổi mật khẩu'
      }
      open={userLogin?.needChangePassword || showChangePassModal}
      footer={null}
      closable={!!showChangePassModal}
      width={700}
      onCancel={handleClose}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        labelWrap
        onFinish={handleFinish}
        validateTrigger={['onSubmit', 'onBlur']}
        labelAlign="left"
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-white p-4">
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <Form.Item
                  label="Mật khẩu cũ"
                  name="oldPwd"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve();
                        } else if (!cleanUpPhoneNumber(value)) {
                          return Promise.reject(
                            'Mật khẩu cũ không được bỏ trống'
                          );
                        } else if (!passwordRegex.test(value)) {
                          return Promise.reject(
                            'Mật khẩu phải có độ dài tối thiểu 8 kí tự, chứa ít nhất một chữ thường, chữ hoa, số và ký tự đặc biệt'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu cũ"
                    maxLength={50}
                    onBlur={() => {
                      const value: string = form.getFieldValue('oldPwd');
                      form.setFieldValue('oldPwd', cleanUpPhoneNumber(value));
                    }}
                    onPaste={(e) => {
                      handlePates(e, 'oldPwd');
                    }}
                    onKeyDown={(e: AnyElement) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPwd"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve();
                        } else if (!cleanUpPhoneNumber(value)) {
                          return Promise.reject(
                            'Mật khẩu mới không được bỏ trống'
                          );
                        } else if (!passwordRegex.test(value)) {
                          return Promise.reject(
                            'Mật khẩu phải có độ dài tối thiểu 8 kí tự, chứa ít nhất một chữ thường, chữ hoa, số và ký tự đặc biệt'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu mới"
                    maxLength={50}
                    onPaste={(e) => {
                      handlePates(e, 'newPwd');
                    }}
                    onBlur={() => {
                      const value: string = form.getFieldValue('newPwd');
                      form.setFieldValue('newPwd', cleanUpPhoneNumber(value));
                      if (form.getFieldValue('password')) {
                        form.validateFields(['password']);
                      }
                    }}
                    onKeyDown={(e: AnyElement) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e: AnyElement) =>
                      (e.target.value = cleanUpPhoneNumber(e.target.value))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve();
                        } else if (!cleanUpPhoneNumber(value)) {
                          return Promise.reject(
                            'Vui lòng nhập lại mật khẩu mới để xác nhận.'
                          );
                        } else if (value !== form.getFieldValue('newPwd')) {
                          return Promise.reject(
                            'Mật khẩu xác nhận và mật khẩu mới không trùng khớp'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập xác nhận mật khẩu mới"
                    maxLength={50}
                    onBlur={() => {
                      const value: string = form.getFieldValue('password');
                      form.setFieldValue('password', cleanUpPhoneNumber(value));
                      if (form.getFieldValue('newPwd')) {
                        form.validateFields(['newPwd']);
                      }
                    }}
                    onInput={(e: AnyElement) =>
                      (e.target.value = cleanUpPhoneNumber(e.target.value))
                    }
                    onKeyDown={(e: AnyElement) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              disabled={loadingUpdatePass}
              loading={loadingUpdatePass}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Form>
    </CModal>
  );
};
