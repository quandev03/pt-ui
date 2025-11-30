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
import { Col, Form, Image, Row, Spin } from 'antd';
import { FocusEvent, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BgLogin from '../../../assets/images/background_login.jpg';
import Logo from '../../../assets/images/logo.jpg';
import { ACCESS_TOKEN_KEY } from '../../../constants';
import { pathRoutes } from '../../../routers/url';
import useConfigAppStore from '../../Layouts/stores';
import ModalForgotPassword from '../components/ModalForgotPassword';
import { useSupportLoginLocal } from '../hooks';
import { ILoginDataRequest } from '../types';
import { globalService } from '../../../../src/services';

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
    if (isAuthenticated && token) {
      handleRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const { mutate: loginLocal, isPending: loadingLoginLocal } =
    useSupportLoginLocal(
      async () => {
        const menuData = await globalService.getMenu();
        setMenuData(menuData);
        localStorage.setItem(
          'partner_code',
          form.getFieldValue('client_identity')
        );
        setIsAuthenticated(true);
      },
      (err: IErrorResponse) => {
        if (err.errors) {
          setFieldError(form, err.errors);
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
  useEffect(() => {
    const savedPartnerCode = localStorage.getItem('partner_code');
    if (savedPartnerCode) {
      form.setFieldsValue({ client_identity: savedPartnerCode });
    }
  }, [form]);

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
              autoComplete="on"
              className="!w-full"
            >
              <Form.Item
                label={<div className="font-bold">Mã đối tác</div>}
                name="client_identity"
                rules={[validateForm.required]}
              >
                <CInput
                  onBlur={(e) => {
                    handleBlur(e, 'client_identity');
                  }}
                  onPaste={(e) => {
                    handlePates(e, 'client_identity');
                  }}
                  className="login-form__input"
                  placeholder={'Nhập mã đối tác'}
                  maxLength={50}
                  name="partner_code" // Đặt name khác để Chrome coi là field riêng
                  autoComplete="on" // Nhóm riêng biệt
                />
              </Form.Item>
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
        <Col span={12}>
          <div className="text-center flex flex-col gap-3">
            <span className="text-[#005aaa] text-3xl font-semibold drop-shadow-md">
              Hệ thống Kinh doanh và quản lý phòng trọ
            </span>
            <span className="text-[#e50013] text-3xl font-semibold drop-shadow-md flex items-center justify-center gap-2">
              QLPT-VN
            </span>
          </div>
          <div className="flex justify-center mt-16">
            <Image src="" preview={false} />
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
