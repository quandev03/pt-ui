import { Image, Spin } from 'antd';
import BgLogin from 'apps/Partner/src/assets/images/bg-login.png';
import Logo from 'apps/Partner/src/assets/images/logo.svg';
import Smartphone from 'apps/Partner/src/assets/images/smartphone.png';
import FormLogin from 'apps/Partner/src/modules/Auth/components/FormLogin';
import { useIsMutating } from '@tanstack/react-query';

const LoginPage = () => {
  const totalMutating = useIsMutating({ mutationKey: ['login'] });
  return (
    <Spin spinning={!!totalMutating}>
      <div
        className="h-screen w-screen bg-inherit !m-0 p-12 sm:px-28 md:px-36 lg:px-40 xl:px-48 2xl:px-56 text-left bg-cover flex flex-1 justify-center lg:gap-64 xl:gap-32 2xl:gap-[400px]"
        style={{
          backgroundImage: `url(${BgLogin})`,
        }}
      >
        <div
          className="mt-32 hidden sm:hidden md:hidden lg:hidden xl:flex items-star justify-center">
          <Image src={Smartphone} preview={false} />
        </div>
        <div className="mt-24 flex w-full sm:w-full md:w-full lg:w-[600px] 2xl:w-[400px]">
          <div
            className="p-10 pb-5 bg-white rounded-lg flex items-center flex-col w-[500px] h-max mt-7 "
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
            <FormLogin />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default LoginPage;
