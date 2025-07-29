import { RouterConfig } from 'apps/Partner/src/routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';
import DashboardPage from './page';

const routes: RouterConfig[] = [
  {
    path: pathRoutes.dashboard,
    page: <DashboardPage />,
  },
];

export default routes;
