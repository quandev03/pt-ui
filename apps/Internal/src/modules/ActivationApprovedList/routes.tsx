import { lazy } from 'react';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.activationApproveList,
    page: <Page />,
  },
  {
    path: pathRoutes.activationApproveListView(),
    page: <PageView />,
  },
];

export default routes;
