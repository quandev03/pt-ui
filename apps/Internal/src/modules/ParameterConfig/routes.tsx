import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.parameterConfig,
    page: <Page />,
  },
  {
    path: pathRoutes.parameterConfigAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.parameterConfigEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.parameterConfigView(),
    page: <PageView />,
  },
];

export default routes;
