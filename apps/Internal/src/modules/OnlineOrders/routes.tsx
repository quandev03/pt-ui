import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.onlineOrders,
    page: <Page />,
  },
  {
    path: pathRoutes.onlineOrdersEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.onlineOrdersView(),
    page: <PageView />,
  },
];

export default routes;
