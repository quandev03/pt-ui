import { GoogleOAuthProvider } from '@react-oauth/google';
import CButton from '@react/commons/Button';
import { TypeCustom } from '@react/commons/Button/enum';
import CInput from '@react/commons/Input';
import CInputPassword from '@react/commons/InputPass';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { cleanUpPhoneNumber } from '@react/helpers/utils';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { Col, Divider, Form, Image, Row, Spin } from 'antd';
import { GOOGLE_CLIENT_ID } from 'apps/Internal/src/AppConfig';
import Logo from 'apps/Internal/src/assets/images/logo.svg';
import Smartphone from 'apps/Internal/src/assets/images/smartphone.png';
import useConfigAppStore from 'apps/Internal/src/components/layouts/store';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import BgLogin from 'apps/Internal/src/assets/images/bg-login.png';
import { FocusEvent, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginButton, { RedirectLocationState } from '../components/LoginButton';
import { useSupportLoginLocal } from '../queryHooks';
import { ILoginDataRequest } from '../types';
import StorageService from 'apps/Internal/src/helpers/storageService';
import ModalForgotPassword from 'apps/Internal/src/modules/Auth/components/ModalForgotPassword';
import validateForm from '@react/utils/validator';

const LoginPage = () => {
  const totalMutating = useIsMutating({ mutationKey: ['login'] });
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [openForgot, setForgot] = useState(false);
  const queryClient = useQueryClient();
  const { setIsAuthenticated, isAuthenticated } = useConfigAppStore();
  const token = StorageService.getAccessToken();
  const { state: locationState } = useLocation();

  const handleRedirect = () => {
    if (locationState) {
      // state is any by default
      const { redirectTo } = locationState as RedirectLocationState;
      navigate(`${redirectTo.pathname}${redirectTo.search}`);
    } else {
      navigate(pathRoutes.welcome);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      handleRedirect();
    }
  }, []);

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

  const { mutate: loginLocal, isPending: loadingLoginLocal } =
    useSupportLoginLocal(
      () => {
        setIsAuthenticated(true);
        handleRedirect();
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY_KEYS.GET_MENU],
        });
      },
      (err: IErrorResponse) => {
        if (err.errors) {
          setFieldError(err.errors);
        }
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
    form.validateFields([field]);
  };
  return (
    <Spin spinning={!!totalMutating}>
      <Row
        gutter={30}
        className="bg-inherit !m-0 p-12 sm:px-28 md:px-36 lg:px-40 xl:px-48 2xl:px-56 text-left bg-cover h-screen"
        style={{
          backgroundImage: `url(${BgLogin})`,
        }}
      >
        <Col span={12} className="mt-16 flex justify-center">
          <div
            className="mt-10 bg-white h-max p-8 w-[500px] rounded-md "
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
            }}
          >
            <div className="flex items-center justify-center">
              <img
                src={Logo}
                className="!w-36 flex items-center justify-center mb-10"
                alt="Logo"
              />
            </div>
            <p className="mt-0 !mb-8 text-[1rem]  w-full">
              Vui lòng đăng nhập tài khoản để bắt đầu làm việc
            </p>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={(values: ILoginDataRequest) => {
                loginLocal(values);
              }}
              autoComplete="off"
              className="!w-full"
            >
              <Form.Item
                label={<div className="font-bold">Tên đăng nhập</div>}
                name="username"
                rules={[validateForm.required]}
              >
                <CInput
                  onBlur={(e) => {
                    handleBlur(e, 'username');
                  }}
                  onPaste={(e) => {
                    handlePates(e, 'username');
                  }}
                  className="login-form__input"
                  placeholder={'Nhập địa chỉ email'}
                  maxLength={50}
                />
              </Form.Item>

              <Form.Item
                label={<div className="font-bold">Mật khẩu</div>}
                name="password"
                rules={[validateForm.required]}
              >
                <CInputPassword
                  onPaste={(e) => {
                    handlePates(e, 'password');
                  }}
                  onInput={(e: any) =>
                    (e.target.value = cleanUpPhoneNumber(e.target.value))
                  }
                  className="login-form__input"
                  placeholder={'Nhập mật khẩu'}
                  maxLength={50}
                />
              </Form.Item>

              <div className="flex justify-end">
                <div
                  className="self-end text-[#0000ff] cursor-pointer !w-max"
                  onClick={() => {
                    setForgot(true);
                  }}
                >
                  Quên mật khẩu?
                </div>
              </div>

              <div className="mt-5">
                <CButton
                  typeCustom={TypeCustom.Primary}
                  size="large"
                  block
                  loading={loadingLoginLocal}
                  htmlType="submit"
                  className="btn-submit"
                >
                  Đăng nhập
                </CButton>
              </div>
            </Form>
            <Divider style={{ borderColor: '#7cb305' }}>Hoặc</Divider>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <LoginButton />
            </GoogleOAuthProvider>
          </div>
        </Col>
        <Col span={12}>
          <div className="text-center flex flex-col gap-3">
            <span className="text-white text-3xl font-semibold drop-shadow-md">
              Hệ thống Kinh doanh và Dịch vụ khách hàng
            </span>
            <span className="text-[#e50013] text-3xl font-semibold drop-shadow-md flex items-center justify-center gap-2">
              <p className="text-white">-</p> BCSS
              <p className="text-white">-</p>
            </span>
          </div>
          <div className="flex justify-center mt-16">
            <Image src={Smartphone} preview={false} />
          </div>
        </Col>
        <ModalForgotPassword
          open={openForgot}
          onClose={() => {
            setForgot(false);
          }}
        />
      </Row>
    </Spin>
  );
};

export default LoginPage;
