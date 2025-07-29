import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { RouterConfig } from 'apps/Partner/src/routers/ProtectedRoute';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

const authRoutes: RouterConfig[] = [
  {
    path: pathRoutes.login,
    page: <LoginPage />,
  },
  {
    path: pathRoutes.forgotPassword,
    page: <ForgotPassword />,
  },
];

export default authRoutes;
