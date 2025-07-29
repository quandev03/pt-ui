import CModal from '@react/commons/Modal';
import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { passwordRegex } from '@react/constants/regex';
import { cleanUpPhoneNumber } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { useMutation } from '@tanstack/react-query';
import { Button, Col, Form, Input, Row } from 'antd';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import React, { useCallback } from 'react';
import useConfigAppStore from '../../store';
import { IUserInfo } from '../../types';

type PayloadType = {
  newPwd: string;
  oldPwd: string;
  username: string;
};

const ModalChangePassword = () => {
  const [form] = Form.useForm();
  const { showChangePassModal, setShowChangePassModal, logoutStore } =
    useConfigAppStore();

  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );
  const fetcher = (payload: PayloadType) => {
    return axiosClient.post<any, any>(
      `${prefixAuthServicePrivate}/api/auth/change-password`,
      payload
    );
  };
  const handlePates = async (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = (e.target as HTMLInputElement).value;
    form.setFieldValue(field, cleanUpPhoneNumber(value.trim()));
    form.validateFields([field]);
  };

  const { mutate: updatePassword, isPending: loadingUpdatePass } = useMutation({
    mutationFn: fetcher,
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
        setFieldError(error?.errors);
      }
    },
  });

  const handleFinish = (values: PayloadType) => {
    updatePassword({
      newPwd: values.newPwd,
      oldPwd: values.oldPwd,
      username: currentUser?.username ?? '',
    });
  };
  const handleClose = () => {
    setShowChangePassModal(false);
    form.resetFields();
  };
  return (
    <CModal
      title={
        currentUser?.needChangePassword
          ? 'Vui lòng đổi mật khẩu để tiếp tục sử dụng hệ thống'
          : 'Đổi mật khẩu'
      }
      open={currentUser?.needChangePassword || showChangePassModal}
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
      >
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-md">
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
                    maxLength={100}
                    onBlur={() => {
                      const value: string = form.getFieldValue('oldPwd');
                      form.setFieldValue('oldPwd', cleanUpPhoneNumber(value));
                    }}
                    onPaste={(e) => {
                      handlePates(e, 'oldPwd');
                    }}
                    onKeyDown={(e: any) => {
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
                    maxLength={100}
                    onPaste={(e) => {
                      handlePates(e, 'newPwd');
                    }}
                    onKeyDown={(e: any) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e: any) =>
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
                    maxLength={100}
                    onBlur={() => {
                      const value: string = form.getFieldValue('password');
                      form.setFieldValue('password', cleanUpPhoneNumber(value));
                    }}
                    onKeyDown={(e: any) => {
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

export default ModalChangePassword;
