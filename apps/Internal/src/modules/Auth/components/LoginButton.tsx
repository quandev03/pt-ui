import { useGoogleLogin } from '@react-oauth/google';
import { NotificationError } from '@vissoft-react/common';
import { useLocation, useNavigate } from 'react-router-dom';
import useConfigAppStore from '../../../modules/Layouts/stores';
import { pathRoutes } from '../../../routers/url';
import { useSupportLogin } from '../hooks';
export type RedirectLocationState = {
  redirectTo: Location;
};

const LoginButton = () => {
  const navigate = useNavigate();
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
        navigate(pathRoutes.welcome);
      }
    },
    (error) => {
      console.log('🚀 ~ LoginButton ~ error:', error);
      NotificationError({
        message: error.detail,
      });
    }
  );
  const handleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (tokenResponse) => {
      callBackSSOAction(tokenResponse.code);
    },
    onError: (error) => console.log('error :>> ', error),
  });
};

export default LoginButton;
