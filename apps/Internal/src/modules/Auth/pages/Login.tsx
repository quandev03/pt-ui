import { GoogleOAuthProvider } from '@react-oauth/google';
import { useIsMutating } from '@tanstack/react-query';
import {
  AnyElement,
  CButton,
  CInput,
  CInputPassword,
  IErrorResponse,
  StorageService,
  cleanUpPhoneNumber,
  setFieldError,
  usePermissions,
  validateForm,
} from '@vissoft-react/common';
import { Col, Divider, Form, Image, Row, Spin } from 'antd';
import { globalService } from 'apps/Internal/src/services/globalService';
import { FocusEvent, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BgLogin from '../../../assets/images/background_login.jpg';
import Logo from '../../../assets/images/logo.jpg';
import { ACCESS_TOKEN_KEY, GOOGLE_CLIENT_ID } from '../../../constants';
import { pathRoutes } from '../../../routers/url';
import useConfigAppStore from '../../Layouts/stores';
import ModalForgotPassword from '../components/ModalForgotPassword';
import { useSupportLoginLocal } from '../hooks';

const LoginPage = () => {
  const totalMutating = useIsMutating({ mutationKey: ['login'] });
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [openForgot, setForgot] = useState(false);
  const { setIsAuthenticated, isAuthenticated, menuData, setMenuData } =
    useConfigAppStore();
  const token = StorageService.get(ACCESS_TOKEN_KEY);
  const { state: locationState } = useLocation();
  const permission = usePermissions(menuData, pathRoutes.dashboard);
  
  const { mutate: loginLocal, isPending: loadingLoginLocal } =
    useSupportLoginLocal(
      async () => {
        // Đảm bảo token đã được lưu trước khi gọi API
        await new Promise((resolve) => setTimeout(resolve, 100));
        try {
        const menuData = await globalService.getMenu();
        setMenuData(menuData);
        setIsAuthenticated(true);
          // Đợi một chút để đảm bảo state đã được update
          setTimeout(() => {
            handleRedirect();
          }, 50);
        } catch (error) {
          console.error('Failed to load menu after login:', error);
          // Vẫn set authenticated để có thể redirect
          setIsAuthenticated(true);
          setTimeout(() => {
            handleRedirect();
          }, 50);
        }
      },
      (err: IErrorResponse) => {
        if (err.errors) {
          setFieldError(form, err.errors);
        }
      }
    );

  const handleRedirect = useCallback(() => {
    if (locationState) {
      const { pathname, search } = locationState;
      navigate(`${pathname}${search}`);
    } else if (permission.canRead) {
      navigate(pathRoutes.dashboard);
    } else {
      navigate(pathRoutes.welcome);
    }
  }, [locationState, permission, navigate]);

  useEffect(() => {
    // Chỉ redirect nếu đã authenticated và có token, nhưng không redirect nếu vừa mới login
    // (để tránh conflict với redirect trong onSuccess)
    if (isAuthenticated && token && !loadingLoginLocal) {
      handleRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, loadingLoginLocal]);

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
    <Spin spinning={!!totalMutating} wrapperClassName="flex-1">
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
                className="!w-20 flex items-center justify-center mb-10"
                alt="Logo"
              />
              <span className="text-[#005aaa] text-3xl font-semibold drop-shadow-md">
              Hệ thống Quản lý Nhà trọ
            </span>
            </div>
            <p className="mt-0 !mb-8 text-[1rem]  w-full">
              Vui lòng đăng nhập tài khoản để bắt đầu làm việc
            </p>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={loginLocal}
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
                  onInput={(e: AnyElement) =>
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
                  type="primary"
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
