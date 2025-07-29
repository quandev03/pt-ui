import { useGoogleLogin } from '@react-oauth/google';
import { NotificationError } from '@react/commons/Notification';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { ReactComponent as GoogleIcon } from 'apps/Internal/src/assets/images/GoogleIcon.svg';
import useConfigAppStore from 'apps/Internal/src/components/layouts/store';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useSupportLogin } from 'apps/Internal/src/modules/Auth/queryHooks';
import { useLocation, useNavigate } from 'react-router-dom';
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
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_MENU],
      });
      if (locationState) {
        // state is any by default
        const { redirectTo } = locationState as RedirectLocationState;
        navigate(`${redirectTo.pathname}${redirectTo.search}`);
      } else {
        navigate(pathRoutes.welcome);
      }
    },
    (error) => {
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
      icon={<GoogleIcon />}
      className="font-medium !px-12 h-12 border-0 shadow-[0_10px_20px_#D2D2D2] hover:!bg-[#4877ef28] hover:!text-black w-full"
    >
      <div>Đăng nhập với Google</div>
    </Button>
  );
};

export default LoginButton;
