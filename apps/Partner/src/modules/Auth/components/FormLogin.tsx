import CButton from '@react/commons/Button';
import { TypeCustom } from '@react/commons/Button/enum';
import CInput from '@react/commons/Input';
import CInputPassword from '@react/commons/InputPass';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { cleanUpPhoneNumber } from '@react/helpers/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useSupportLoginLocal } from 'apps/Partner/src/modules/Auth/queryHooks';
import { FocusEvent, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import useConfigAppStore from '../../../components/layouts/store';
import { ILoginDataRequest } from '../types';
import ModalForgotPassword from './ModalForgotPassword';

const FormLogin = () => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [openForgot, setForgot] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useConfigAppStore();

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
        navigate(pathRoutes.welcome);
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
  const handleBlur = (
    e: FocusEvent<HTMLInputElement>,
    field: string,
    isUpperCase?: boolean
  ) => {
    let value = (e.target as HTMLInputElement).value.trim();
    if (isUpperCase) {
      value = value.toUpperCase();
    }
    form.setFieldValue(field, value);
    form.validateFields([field]);
  };

  const handlePates = async (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: string,
    isUpperCase?: boolean
  ) => {
    let value = (e.target as HTMLInputElement).value.trim();
    if (isUpperCase) {
      value = value.toUpperCase();
    }
    form.setFieldValue(field, value);
    form.validateFields([field]);
  };

  return (
    <div className="flex gap-6 flex-col justify-center items-center w-full">
      <div className="text-3xl font-bold">
        <FormattedMessage id={'auth.login'} />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values: ILoginDataRequest) => {
          loginLocal(values);
        }}
        className="!w-full"
      >
        <Form.Item
          label={<div className="font-bold">Mã đối tác</div>}
          name="client_identity"
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
              handleBlur(e, 'client_identity', true);
            }}
            onPaste={(e) => {
              handlePates(e, 'client_identity', true);
            }}
            placeholder={'Nhập mã đối tác'}
            maxLength={100}
            onInput={(e: any) =>
              (e.target.value = e.target.value.toUpperCase())
            }
          />
        </Form.Item>

        <Form.Item
          label={<div className="font-bold">Tên đăng nhập</div>}
          name="username"
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
              handleBlur(e, 'username');
            }}
            onPaste={(e) => {
              handlePates(e, 'username');
            }}
            className="login-form__input"
            placeholder={'Nhập username'}
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label={<div className="font-bold">Mật khẩu</div>}
          name="password"
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
          <CInputPassword
            onPaste={(e) => {
              handlePates(e, 'password');
            }}
            onInput={(e: any) =>
              (e.target.value = cleanUpPhoneNumber(e.target.value))
            }
            className="login-form__input"
            placeholder={intl.formatMessage({ id: 'auth.placeholderPass' })}
            maxLength={100}
          />
        </Form.Item>

        <div className="flex justify-end">
          <div
            className="mb-5 self-end text-[#0000ff] cursor-pointer !w-max"
            onClick={() => {
              setForgot(true);
            }}
          >
            Quên mật khẩu?
          </div>
        </div>

        <Form.Item>
          <CButton
            typeCustom={TypeCustom.Primary}
            size="large"
            block
            loading={loadingLoginLocal}
            htmlType="submit"
            className="btn-submit"
          >
            <FormattedMessage id={'auth.login'} />
          </CButton>
        </Form.Item>
        {/* {!!errDetail && <ErrorDetail>{errDetail}</ErrorDetail>} */}
      </Form>
      <ModalForgotPassword
        open={openForgot}
        onClose={() => {
          setForgot(false);
        }}
      />
    </div>
  );
};

export default FormLogin;
