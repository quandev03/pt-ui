import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.customerReasonList,
    page: <Page />,
  },
  {
    path: pathRoutes.customerReasonAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.customerReasonEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.customerReasonView(),
    page: <PageView />,
  },
];

export default routes;
