import BgLogin from '../../../assets/images/bg-login.png';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSupportGetNewPassword } from '../hooks';
import Logo from '../../../assets/images/logo.svg';
import { CButton, Text } from '@vissoft-react/common';
import { Copy } from 'lucide-react';
import { pathRoutes } from '../../../routers/url';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [newPass, setNewPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate: getNewPassword } = useSupportGetNewPassword(
    (data) => {
      setNewPass(data.value);
    },
    (error) => {
      setErrorMessage(error.detail);
    }
  );

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      getNewPassword({ token });
    }
    return () => {
      setNewPass('');
      setErrorMessage('');
    };
  }, [getNewPassword, params]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(newPass)
      .then(() => {
        message.success('Sao chép thành công!');
      })
      .catch(() => {
        message.error('Sao chép thất bại!');
      });
  };

  return (
    <div
      className="h-screen w-screen bg-inherit !m-0 p-12 sm:px-28 md:px-36 lg:px-40 xl:px-48 2xl:px-56 text-left bg-cover flex justify-center gap-[300px]"
      style={{
        backgroundImage: `url(${BgLogin})`,
      }}
    >
      <div className="mt-52 flex">
        <div
          className="p-10 min-w-[550px] pb-5 bg-white rounded-lg flex items-center flex-col w-full h-max mt-7 "
          style={{
            boxShadow:
              'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
          }}
        >
          <img
            src={Logo}
            className="!w-36 flex items-center justify-center mb-10"
            alt="Logo"
          />
          <Text type="danger" className="!font-bold !text-lg mb-7">
            {errorMessage
              ? errorMessage
              : 'Vui lòng đổi mật khẩu an toàn ngay sau khi đăng nhập.'}
          </Text>

          {errorMessage ? null : (
            <div className="min-w-80 flex items-center border border-gray-700 rounded-lg p-2 max-w-md mb-7">
              <span className="text-gray-600 font-mono">{newPass}</span>
              <button
                onClick={handleCopy}
                className="ml-auto p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          <div className="mb-6">
            <CButton
              type="primary"
              onClick={() => {
                navigate(pathRoutes.login as string);
              }}
            >
              {errorMessage ? 'Đóng' : 'Đăng nhập ngay'}
            </CButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
