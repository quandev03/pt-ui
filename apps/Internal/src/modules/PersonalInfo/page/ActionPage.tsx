import {
  AnyElement,
  CButtonClose,
  CButtonSave,
  CInput,
  cleanUpPhoneNumber,
  CSelect,
  handlePasteRemoveTextKeepNumber,
  IFieldErrorsItem,
  MESSAGE,
  ModalConfirm,
  NotificationSuccess,
  phoneRegex,
  TitleHeader,
  validateForm,
} from '@vissoft-react/common';
import { Card, Col, Form, Row, Space, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditProfile } from '../hook/useEditProfile';
import useGetProfile from '../hook/useGetProfile';

export const ActionPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data, isPending } = useGetProfile();
  const { mutateAsync: updateProfile, isPending: isLoadingEditProfile } =
    useEditProfile();
  useEffect(() => {
    form.setFieldsValue({
      ...data,
      roles: data?.roles.map((role: AnyElement) => role.id),
    });
  }, [data, form]);
  const handleConfirm = async (values: any) => {
    const { fullname, phoneNumber } = values;

    try {
      const profilePromise = updateProfile({ fullname, phoneNumber });
      await profilePromise;
      NotificationSuccess(MESSAGE.G02);
      navigate(-1);
    } catch (err: any) {
      if (err?.errors?.length) {
        form.setFields(
          err.errors.map((e: IFieldErrorsItem) => ({
            field: e.field,
            errors: [e.detail],
          }))
        );
      }
    }
  };
  const roleOptions = useMemo(() => {
    if (data?.roles) {
      return data?.roles.map((roleOption: AnyElement) => ({
        label: roleOption.name,
        value: roleOption.id,
      }));
    }
    return [];
  }, [data?.roles]);
  const handleFinish = (values: any) => {
    ModalConfirm({
      message: MESSAGE.G04,
      handleConfirm: () => {
        handleConfirm(values);
      },
    });
  };
  const handleCancel = () => {
    navigate(-1);
  };
  console.log(data, 'data');
  return (
    <>
      <TitleHeader>{`Thông tin tài khoản`}</TitleHeader>
      <Spin spinning={isLoadingEditProfile || isPending}>
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ flex: '130px' }}
        >
          <Card className="mb-5">
            <div className="font-bold text-base text-primary mb-5">
              Thông tin tài khoản
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullname"
                  rules={[validateForm.required]}
                >
                  <CInput maxLength={50} placeholder="Họ và tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Username" name="username">
                  <CInput maxLength={100} disabled placeholder="Username" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="SĐT"
                  name="phoneNumber"
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || !cleanUpPhoneNumber(value)) {
                          return Promise.resolve();
                        } else if (!phoneRegex.test(value)) {
                          return Promise.reject('SĐT không đúng định dạng');
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    maxLength={10}
                    placeholder="Nhập SĐT"
                    onlyNumber
                    onPaste={(event) =>
                      handlePasteRemoveTextKeepNumber(event, 10)
                    }
                    onInput={(e: any) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ''))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <CInput maxLength={100} disabled placeholder="Email" />
                </Form.Item>
              </Col>
              
            </Row>
          </Card>
          <Row justify="end" className="mt-4">
            <Space size="middle">
              <CButtonSave htmlType="submit">Lưu</CButtonSave>
              <CButtonClose type="default" onClick={handleCancel} />
            </Space>
          </Row>
        </Form>
      </Spin>
    </>
  );
};
