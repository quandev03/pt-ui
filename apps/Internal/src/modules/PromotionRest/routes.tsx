import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.promotionRestManagement,
    page: <Page />,
  },
  {
    path: pathRoutes.promotionRestAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.promotionRestEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.promotionRestView(),
    page: <PageView />,
  },
];

export default routes;
