import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import Login from './pages/Login';

const authRoutes: RouterConfig[] = [
  {
    path: pathRoutes.login,
    page: <Login />,
  },
];

export default authRoutes;
