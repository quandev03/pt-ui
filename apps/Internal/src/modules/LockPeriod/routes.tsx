import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const LockPeriodPage = lazy(() => import('./pages/index'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.cycleLock,
    page: <LockPeriodPage />,
  },
];
export default routes;
