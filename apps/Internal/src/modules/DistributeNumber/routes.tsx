import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const PagePhoneNoDistribution = lazy(() => import('./page'));
const ActionPage = lazy(() => import('./page/ActionPage'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.distributeNumber,
    page: <PagePhoneNoDistribution />,
  },
  {
    path: pathRoutes.distributeNumberAdd,
    page: <ActionPage />,
  },
  {
    path: pathRoutes.distributeNumberView(),
    page: <ActionPage />,
  },
];
export default routes;
