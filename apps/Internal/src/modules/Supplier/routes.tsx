import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.supplier,
    page: <Page />,
  },
  {
    path: pathRoutes.supplier_add,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.supplier_edit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.supplier_view(),
    page: <PageView />,
  },
];

export default routes;
