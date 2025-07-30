import { useGoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationError } from '@vissoft-react/common';
import { Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleIcon from '../../../assets/images/GoogleIcon.svg';
import useConfigAppStore from '../../../modules/Layouts/stores';
import { pathRoutes } from '../../../routers/url';
import { useSupportLogin } from '../hooks';
export type RedirectLocationState = {
  redirectTo: Location;
};

const LoginButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setIsAuthenticated } = useConfigAppStore();
  const { state: locationState } = useLocation();

  const { mutate: callBackSSOAction } = useSupportLogin(
    () => {
      setIsAuthenticated(true);

      if (locationState) {
        // state is any by default
        const { pathname, search } = locationState;
        navigate(`${pathname}${search}`);
      } else {
        navigate(pathRoutes.welcome as string);
      }
    },
    (error) => {
      console.log('🚀 ~ LoginButton ~ error:', error);
      NotificationError(error.detail);
    }
  );
  const handleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (tokenResponse) => {
      callBackSSOAction(tokenResponse.code);
    },
    onError: (error) => console.log('error :>> ', error),
  });

  return (
    <Button
      onClick={() => handleLogin()}
      icon={<img src={GoogleIcon} alt="Google" />}
      className="font-medium !px-12 h-12 border-0 shadow-[0_10px_20px_#D2D2D2] hover:!bg-[#4877ef28] hover:!text-black w-full"
    >
      <div>Đăng nhập với Google</div>
    </Button>
  );
};

export default LoginButton;
