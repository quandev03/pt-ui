import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.category_product,
    page: <Page />,
  },
  {
    path: pathRoutes.category_product_add,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.category_product_edit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.category_product_view(),
    page: <PageView />,
  },
];

export default routes;
