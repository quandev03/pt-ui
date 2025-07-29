import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.deliveryPromotionscategory,
    page: <Page />,
  },
  {
    path: pathRoutes.deliveryPromotionscategoryAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.deliveryPromotionscategoryEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.deliveryPromotionscategoryView(),
    page: <PageView />,
  },
];

export default routes;
