import { lazy } from 'react';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.activationRequestList,
    page: <Page />,
  },
  {
    path: pathRoutes.activationRequestListCreate,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.activationRequestListEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.activationRequestListView(),
    page: <PageView />,
  },
];

export default routes;
